# Tallies clubs per country once per build into site.data["country_counts"],
# keyed by uppercase ISO code, so the country dropdown (on every page) reads a
# precomputed count instead of scanning the clubs collection. Only counts
# language == "en" docs so the language clones don't get counted twice.

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
    end
  end
end
