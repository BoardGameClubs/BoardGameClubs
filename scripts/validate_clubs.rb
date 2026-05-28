#!/usr/bin/env ruby
# frozen_string_literal: true

# Validates all _clubs/<country>/*.md files for correct YAML frontmatter.
# Country-aware: lat/lng bounds + URL prefix come from _data/countries.yml.
# Also enforces folder ↔ country agreement (a file at _clubs/de/foo.md must
# have `country: "DE"`).
# Requires only Ruby stdlib.
# Usage: ruby scripts/validate_clubs.rb

require "yaml"
require "date"

VALID_DAYS = %w[Monday Tuesday Wednesday Thursday Friday Saturday Sunday Various].freeze
VALID_TYPES = ["Board Games", "RPG", "Wargames", "BOTC", "TCG"].freeze

root_dir  = File.expand_path("..", __dir__)
clubs_dir = File.join(root_dir, "_clubs")
data_path = File.join(root_dir, "_data", "countries.yml")

unless File.exist?(data_path)
  puts "ERROR: _data/countries.yml not found at #{data_path}"
  exit 1
end

countries   = YAML.safe_load(File.read(data_path), permitted_classes: [Symbol])
valid_codes = countries.values.map { |c| c["code"] }
bounds_by_code = countries.values.each_with_object({}) do |c, h|
  h[c["code"]] = {
    lat: (c["bounds"]["lat"][0].to_f..c["bounds"]["lat"][1].to_f),
    lng: (c["bounds"]["lng"][0].to_f..c["bounds"]["lng"][1].to_f),
  }
end
url_prefix_by_code = countries.values.each_with_object({}) do |c, h|
  h[c["code"]] = c["url_prefix"] || ""
end

unless Dir.exist?(clubs_dir)
  puts "ERROR: _clubs/ directory not found at #{clubs_dir}"
  exit 1
end

# Files now live under _clubs/<country>/*.md.
files = Dir.glob(File.join(clubs_dir, "*", "*.md")).sort
if files.empty?
  puts "ERROR: No .md files found under _clubs/<country>/"
  exit 1
end

# Flat-layout migration check: complain if any clubs remain at the top level.
stray = Dir.glob(File.join(clubs_dir, "*.md"))
unless stray.empty?
  puts "ERROR: #{stray.length} club file(s) still at the top level of _clubs/. Run scripts/reorg_clubs.rb."
  stray.each { |f| puts "  - #{File.basename(f)}" }
  exit 1
end

errors = {}
slugs_seen = {}

files.each do |file|
  rel        = file.sub("#{clubs_dir}/", "")              # e.g. "gb/aberdeen.md"
  folder     = File.dirname(rel)                          # "gb"
  basename   = File.basename(file)
  slug       = File.basename(file, ".md")
  file_id    = rel
  file_errors = []

  if slugs_seen.key?(slug)
    file_errors << "Duplicate slug '#{slug}' (also used by #{slugs_seen[slug]})"
  else
    slugs_seen[slug] = rel
  end

  content = File.read(file)

  unless content.match?(/\A---\s*\n/)
    file_errors << "Missing YAML frontmatter (file must start with ---)"
    errors[file_id] = file_errors
    next
  end

  parts = content.split(/^---\s*$/, 3)
  if parts.length < 3
    file_errors << "Invalid frontmatter format (missing closing ---)"
    errors[file_id] = file_errors
    next
  end

  begin
    data = YAML.safe_load(parts[1], permitted_classes: [Date])
  rescue Psych::SyntaxError => e
    file_errors << "Invalid YAML: #{e.message}"
    errors[file_id] = file_errors
    next
  end

  unless data.is_a?(Hash)
    file_errors << "Frontmatter must be a YAML mapping, got #{data.class}"
    errors[file_id] = file_errors
    next
  end

  # country: required, must match the folder it lives in.
  country_code = data["country"]
  if !country_code.is_a?(String) || country_code.strip.empty?
    file_errors << "country: required (one of #{valid_codes.join(', ')})"
  elsif !valid_codes.include?(country_code)
    file_errors << "country: must be one of #{valid_codes.join(', ')} (got #{country_code.inspect})"
  elsif folder.downcase != country_code.downcase
    file_errors << "country: '#{country_code}' must match folder '#{folder}/' — move the file or change the field"
  end

  # name: non-empty string
  if !data["name"].is_a?(String) || data["name"].strip.empty?
    file_errors << "name: must be a non-empty string"
  end

  # days
  if !data["days"].is_a?(Array) || data["days"].empty?
    file_errors << "days: must be a non-empty array of day names (got #{data['days'].inspect})"
  elsif data["days"].is_a?(Array)
    data["days"].each_with_index do |d, i|
      unless d.is_a?(String) && VALID_DAYS.include?(d)
        file_errors << "days[#{i}]: must be one of #{VALID_DAYS.join(', ')} (got #{d.inspect})"
      end
    end
  end

  # type (optional)
  if data.key?("type")
    if !data["type"].is_a?(Array) || data["type"].empty?
      file_errors << "type: must be a non-empty array of types (got #{data['type'].inspect})"
    elsif data["type"].is_a?(Array)
      data["type"].each_with_index do |t, i|
        unless t.is_a?(String) && VALID_TYPES.include?(t)
          file_errors << "type[#{i}]: must be one of #{VALID_TYPES.join(', ')} (got #{t.inspect})"
        end
      end
    end
  end

  # frequency
  if !data["frequency"].is_a?(String) || data["frequency"].strip.empty?
    file_errors << "frequency: must be a non-empty string"
  end

  # description
  if !data["description"].is_a?(String) || data["description"].strip.empty?
    file_errors << "description: must be a non-empty string"
  end

  # location
  loc = data["location"]
  if !loc.is_a?(Hash)
    file_errors << "location: must be a mapping with name, address, lat, lng"
  else
    if !loc["name"].is_a?(String) || loc["name"].strip.empty?
      file_errors << "location.name: must be a non-empty string"
    end
    if !loc["address"].is_a?(String) || loc["address"].strip.empty?
      file_errors << "location.address: must be a non-empty string"
    end

    bounds = bounds_by_code[country_code]
    if !loc["lat"].is_a?(Numeric)
      file_errors << "location.lat: must be a number (got #{loc['lat'].inspect})"
    elsif bounds && !bounds[:lat].cover?(loc["lat"])
      file_errors << "location.lat: must be between #{bounds[:lat].min} and #{bounds[:lat].max} for country #{country_code} (got #{loc['lat']})"
    end

    if !loc["lng"].is_a?(Numeric)
      file_errors << "location.lng: must be a number (got #{loc['lng'].inspect})"
    elsif bounds && !bounds[:lng].cover?(loc["lng"])
      file_errors << "location.lng: must be between #{bounds[:lng].min} and #{bounds[:lng].max} for country #{country_code} (got #{loc['lng']})"
    end
  end

  # permalink: must NOT be set. Clubs live at canonical /clubs/<slug>/ and
  # _plugins/club_language_clones.rb emits per-language copies at
  # /<lang>/clubs/<slug>/. A hand-written permalink would override that.
  if data["permalink"]
    file_errors << "permalink: must not be set (got #{data['permalink'].inspect}); clubs live at /clubs/<slug>/ by default"
  end

  errors[file_id] = file_errors unless file_errors.empty?
end

if errors.empty?
  puts "All #{files.length} club files are valid."
  exit 0
else
  puts "Validation failed!\n\n"
  errors.each do |file, file_errors|
    puts "  #{file}:"
    file_errors.each { |e| puts "    - #{e}" }
    puts
  end
  total = errors.values.sum(&:length)
  puts "#{total} error(s) in #{errors.length} file(s)."
  exit 1
end
