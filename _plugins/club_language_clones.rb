# Emits one club detail page per supported language.
#
# Every club in _clubs/ becomes:
#   /clubs/<slug>/        (English chrome, language: "en")
#   /de/clubs/<slug>/     (German chrome, language: "de")
#   /it/clubs/<slug>/     (Italian)
#   /fr/clubs/<slug>/     (French)
#   /es/clubs/<slug>/     (Spanish)
#   /pl/clubs/<slug>/     (Polish)
#
# The URL prefix sets the visitor's site language; the map/sidebar JS links to
# the matching language clone so navigation never flips lang. Body strings (day
# names, table labels) follow page.language to match the chrome.
#
# Pages has to deploy via GitHub Actions for this to run, since plugin
# generators aren't on the GitHub Pages whitelist.

module GameClub
  class ClubLanguageClones < Jekyll::Generator
    safe true
    priority :low

    LANGUAGES = %w[de it fr es pl].freeze

    def generate(site)
      originals = site.collections["clubs"].docs.dup
      Jekyll.logger.info "ClubLanguageClones:", "cloning #{originals.size} clubs x #{LANGUAGES.size} languages"
      originals.each do |doc|
        LANGUAGES.each do |lang|
          site.collections["clubs"].docs << ClubLanguageClone.new(doc, lang, site)
        end
      end
    end
  end

  class ClubLanguageClone < Jekyll::Document
    def initialize(source_doc, lang, site)
      super(source_doc.path, site: site, collection: site.collections["clubs"])
      read
      data["language"] = lang
      data["permalink"] = "/#{lang}#{source_doc.url}"
      @url = nil
    end
  end
end
