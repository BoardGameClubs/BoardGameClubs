#!/usr/bin/env ruby
# frozen_string_literal: true

# Checks club website / meetup / bgg links for signs of being dead and writes a
# maintainer-only report. It never appears on the site; it just helps spot
# stale clubs in a community-maintained directory where links go bad.
#
# What it flags:
#   - DNS failure (domain no longer resolves)
#   - Connection refused / timeout (server gone)
#   - 404 / 410 (page removed)
#   - 5xx (server broken)
# What it skips (too noisy to check from a bot):
#   - facebook / discord links. These return 403/429 to non-browser clients
#     whether or not the club exists, so checking them tells us nothing.
#
# Usage:
#   ruby scripts/check_links.rb                 # check everything, write reports/dead_links.md
#   ruby scripts/check_links.rb --limit 50      # only first 50 clubs (quick smoke test)
#   ruby scripts/check_links.rb --json          # also write reports/dead_links.json
#   ruby scripts/check_links.rb gb              # only clubs in a given country folder
#
# Uses only the Ruby stdlib. Exit code is always 0 (it's a report, not a gate)
# unless something goes structurally wrong.

require "yaml"
require "uri"
require "net/http"
require "date"
require "json"

root_dir  = File.expand_path("..", __dir__)
clubs_dir = File.join(root_dir, "_clubs")
report_dir = File.join(root_dir, "reports")

# --- args ---
limit = nil
want_json = false
country_filter = nil
args = ARGV.dup
until args.empty?
  arg = args.shift
  case arg
  when "--limit" then limit = args.shift.to_i
  when "--json"  then want_json = true
  else
    country_filter = arg.downcase unless arg.start_with?("--")
  end
end

# Links we actually check. facebook/discord deliberately excluded (see header).
CHECKABLE = %w[website meetup bgg].freeze

TIMEOUT = 12        # seconds per request
CONCURRENCY = 12    # parallel checker threads
RETRIES = 1         # one retry on a transient network error before giving up

unless Dir.exist?(clubs_dir)
  warn "ERROR: _clubs/ not found at #{clubs_dir}"
  exit 1
end

glob = country_filter ? File.join(clubs_dir, country_filter, "*.md") : File.join(clubs_dir, "*", "*.md")
files = Dir.glob(glob).sort
files = files.first(limit) if limit
if files.empty?
  warn "No club files matched."
  exit 1
end

# --- collect (club, field, url) tuples ---
Target = Struct.new(:rel, :name, :field, :url)
targets = []
parse_errors = []

files.each do |file|
  rel = file.sub("#{clubs_dir}/", "")
  content = File.read(file)
  parts = content.split(/^---\s*$/, 3)
  next if parts.length < 3

  data = begin
    YAML.safe_load(parts[1], permitted_classes: [Date])
  rescue Psych::SyntaxError => e
    parse_errors << "#{rel}: #{e.message}"
    next
  end
  next unless data.is_a?(Hash)

  name = data["name"] || rel
  CHECKABLE.each do |field|
    url = data[field]
    next if url.nil? || url.to_s.strip.empty?
    targets << Target.new(rel, name, field, url.to_s.strip)
  end
end

warn "Checking #{targets.length} links across #{files.length} clubs (#{CONCURRENCY} at a time)..."

# --- the actual check ---
# Returns [status_symbol, detail_string]. Symbols: :ok, :dead, :suspect
def check_url(raw_url)
  uri = begin
    URI.parse(raw_url)
  rescue URI::InvalidURIError
    return [:suspect, "Unparseable URL"]
  end
  return [:suspect, "Not an http(s) URL"] unless uri.is_a?(URI::HTTP)

  attempt = 0
  begin
    attempt += 1
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.is_a?(URI::HTTPS)
    http.open_timeout = TIMEOUT
    http.read_timeout = TIMEOUT
    # Many servers reject HEAD or bot UAs; use GET with a browser-ish UA and
    # don't download the body beyond headers where we can avoid it.
    req = Net::HTTP::Get.new(uri.request_uri.empty? ? "/" : uri.request_uri)
    req["User-Agent"] = "Mozilla/5.0 (compatible; BoardGameClubs-linkcheck/1.0; +https://boardgameclubs.org)"
    req["Accept"] = "text/html,*/*"

    res = http.request(req)
    code = res.code.to_i

    case code
    when 200..299 then [:ok, "#{code}"]
    when 300..399 then [:ok, "#{code} redirect"] # net/http follows? no — but a redirect means the host is alive
    when 401, 403, 429 then [:ok, "#{code} (blocked bot, host alive)"]
    when 404, 410 then [:dead, "#{code} page gone"]
    when 500..599 then [:suspect, "#{code} server error"]
    else [:suspect, "HTTP #{code}"]
    end
  rescue SocketError
    # DNS / host resolution failure: the strongest signal of a dead domain.
    [:dead, "Domain does not resolve (DNS)"]
  rescue Net::OpenTimeout, Net::ReadTimeout
    retry if attempt <= RETRIES
    [:suspect, "Timeout after #{TIMEOUT}s"]
  rescue Errno::ECONNREFUSED
    [:dead, "Connection refused"]
  rescue OpenSSL::SSL::SSLError => e
    [:suspect, "SSL error: #{e.message.split("\n").first}"]
  rescue StandardError => e
    retry if attempt <= RETRIES
    [:suspect, "#{e.class}: #{e.message.split("\n").first}"]
  end
end

# --- run checks across a thread pool ---
require "thread"
queue = Queue.new
targets.each { |t| queue << t }
results = []
results_mutex = Mutex.new
done = 0
done_mutex = Mutex.new

workers = Array.new(CONCURRENCY) do
  Thread.new do
    loop do
      target = begin
        queue.pop(true)
      rescue ThreadError
        break
      end
      status, detail = check_url(target.url)
      done_mutex.synchronize do
        done += 1
        warn "  [#{done}/#{targets.length}] checked" if (done % 50).zero?
      end
      next if status == :ok
      results_mutex.synchronize do
        results << { rel: target.rel, name: target.name, field: target.field,
                     url: target.url, status: status, detail: detail }
      end
    end
  end
end
workers.each(&:join)

# --- sort: dead first, then suspect; then by country/file ---
order = { dead: 0, suspect: 1 }
results.sort_by! { |r| [order[r[:status]], r[:rel], r[:field]] }

dead = results.select { |r| r[:status] == :dead }
suspect = results.select { |r| r[:status] == :suspect }

# --- write report ---
Dir.mkdir(report_dir) unless Dir.exist?(report_dir)

generated = ENV["LINKCHECK_DATE"] || Time.now.utc.strftime("%Y-%m-%d %H:%M UTC")

lines = []
lines << "# Potentially dead club links"
lines << ""
lines << "_Generated #{generated} by `scripts/check_links.rb`._"
lines << ""
lines << "Checked **#{targets.length}** links (`website`, `meetup`, `bgg`) across **#{files.length}** clubs."
lines << "Facebook/Discord links are not auto-checked (they block bots). Use the community **Report a Club** issues for those."
lines << ""
lines << "- 🔴 **#{dead.length}** likely dead (DNS failure, connection refused, 404/410)"
lines << "- 🟡 **#{suspect.length}** suspect (timeout, server error, SSL — may be transient, re-check before acting)"
lines << ""

render = lambda do |rows, heading|
  lines << "## #{heading}"
  lines << ""
  if rows.empty?
    lines << "_None._"
    lines << ""
    return
  end
  lines << "| Club | Field | URL | Reason | File |"
  lines << "|------|-------|-----|--------|------|"
  rows.each do |r|
    safe_url = r[:url].gsub("|", "%7C")
    lines << "| #{r[:name]} | `#{r[:field]}` | #{safe_url} | #{r[:detail]} | `_clubs/#{r[:rel]}` |"
  end
  lines << ""
end

render.call(dead, "🔴 Likely dead")
render.call(suspect, "🟡 Suspect (verify before acting)")

unless parse_errors.empty?
  lines << "## ⚠️ Files that couldn't be parsed"
  lines << ""
  parse_errors.each { |e| lines << "- #{e}" }
  lines << ""
end

report_path = File.join(report_dir, "dead_links.md")
File.write(report_path, lines.join("\n") + "\n")
warn "Wrote #{report_path}"

if want_json
  json_path = File.join(report_dir, "dead_links.json")
  File.write(json_path, JSON.pretty_generate(
    generated: generated,
    checked: targets.length,
    clubs: files.length,
    dead: dead,
    suspect: suspect
  ) + "\n")
  warn "Wrote #{json_path}"
end

# Machine-readable summary line for CI to grep.
puts "LINKCHECK_RESULT dead=#{dead.length} suspect=#{suspect.length} checked=#{targets.length}"
