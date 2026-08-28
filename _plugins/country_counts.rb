# Tallies clubs per country once per build into site.data["country_counts"],
# keyed by uppercase ISO code, so the country dropdown (on every page) reads a
# precomputed count instead of scanning the clubs collection. Only counts
# language == "en" docs so the language clones don't get counted twice.
#
# Also tallies upcoming events (end_date on or after the build date) into
# site.data["event_counts"] per country and site.data["event_count"] overall,
# for the footer and the README badge. Liquid can't compare dates cleanly, so
# the filtering lives here.

module GameClub
  class CountryCounts < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      counts = Hash.new(0)
      site.collections["clubs"].docs.each do |doc|
        next unless doc.data["language"] == "en"
        code = doc.data["country"]
        counts[code] += 1 if code
      end
      site.data["country_counts"] = counts
      Jekyll.logger.info "CountryCounts:", "tallied #{counts.values.sum} clubs across #{counts.size} countries"

      today = site.time.to_date
      event_counts = Hash.new(0)
      (site.collections["events"]&.docs || []).each do |doc|
        next unless doc.data["language"] == "en"
        finish = doc.data["end_date"] || doc.data["start_date"]
        finish = finish.to_date if finish.respond_to?(:to_date)
        next if finish && finish < today
        code = doc.data["country"]
        event_counts[code] += 1 if code
      end
      site.data["event_counts"] = event_counts
      site.data["event_count"] = event_counts.values.sum
      Jekyll.logger.info "CountryCounts:", "tallied #{site.data["event_count"]} upcoming events across #{event_counts.size} countries"
    end
  end
end
