#!/usr/bin/env ruby
# frozen_string_literal: true

# Validates the YAML frontmatter of every _events/<country>/*.md file.
# lat/lng bounds and URL prefix come from _data/countries.yml. The folder a
# file lives in has to match its country field (_events/de/foo.md needs
# country: "DE"). Uses only the Ruby stdlib.
# Usage: ruby scripts/validate_events.rb

require "yaml"
require "date"

VALID_TYPES = ["Board Games", "RPG", "Wargames", "TCG", "BOTC"].freeze
VALID_FORMATS = ["Convention", "Game Day", "Tournament"].freeze


root_dir  = File.expand_path("..", __dir__)
events_dir = File.join(root_dir, "_events")
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

unless Dir.exist?(events_dir)
  puts "ERROR: _events/ directory not found at #{events_dir}"
  exit 1
end

files = Dir.glob(File.join(events_dir, "*", "*.md")).sort
if files.empty?
  puts "No event files found under _events/<country>/ — nothing to validate."
  exit 0
end

errors = {}
slugs_seen = {}

files.each do |file|
  rel        = file.sub("#{events_dir}/", "")              # e.g. "gb/aberdeen.md"
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

  # country is required and has to match the folder the file lives in.
  country_code = data["country"]
  if !country_code.is_a?(String) || country_code.strip.empty?
    file_errors << "country: required (one of #{valid_codes.join(', ')})"
  elsif !valid_codes.include?(country_code)
    file_errors << "country: must be one of #{valid_codes.join(', ')} (got #{country_code.inspect})"
  elsif folder.downcase != country_code.downcase
    file_errors << "country: '#{country_code}' must match folder '#{folder}/' — move the file or change the field"
  end

  if !data["name"].is_a?(String) || data["name"].strip.empty?
    file_errors << "name: must be a non-empty string"
  end

  # start_date / end_date: ISO dates (YAML parses unquoted YYYY-MM-DD as Date).
  start_date = data["start_date"]
  end_date   = data.key?("end_date") ? data["end_date"] : start_date
  if !start_date.is_a?(Date)
    file_errors << "start_date: must be an ISO date (YYYY-MM-DD, unquoted), got #{start_date.inspect}"
  end
  if !end_date.is_a?(Date)
    file_errors << "end_date: must be an ISO date (YYYY-MM-DD, unquoted), got #{end_date.inspect}"
  elsif start_date.is_a?(Date) && end_date < start_date
    file_errors << "end_date: #{end_date} is before start_date #{start_date}"
  end

  if data.key?("type")
    if !data["type"].is_a?(Array) || data["type"].empty?
      file_errors << "type: must be a non-empty array of types (got #{data['type'].inspect})"
    else
      data["type"].each_with_index do |t, i|
        unless t.is_a?(String) && VALID_TYPES.include?(t)
          file_errors << "type[#{i}]: must be one of #{VALID_TYPES.join(', ')} (got #{t.inspect})"
        end
      end
    end
  end

  if data.key?("format") && !data["format"].nil? && !VALID_FORMATS.include?(data["format"])
    file_errors << "format: must be one of #{VALID_FORMATS.join(', ')} (got #{data['format'].inspect})"
  end

  %w[price tickets website facebook discord bgg image].each do |key|
    if data.key?(key) && !data[key].nil? && !data[key].is_a?(String)
      file_errors << "#{key}: must be a string (got #{data[key].inspect})"
    end
  end

  if data.key?("description") && !data["description"].nil? && !data["description"].is_a?(String)
    file_errors << "description: must be a string (got #{data['description'].inspect})"
  end

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

  # permalink must not be set. Events live at /events/<slug>/ and
  # _plugins/language_clones.rb emits per-language copies at
  # /<lang>/events/<slug>/. A hand-written permalink would override that.
  if data["permalink"]
    file_errors << "permalink: must not be set (got #{data['permalink'].inspect}); events live at /events/<slug>/ by default"
  end

  errors[file_id] = file_errors unless file_errors.empty?
end

if errors.empty?
  puts "All #{files.length} event files are valid."
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
