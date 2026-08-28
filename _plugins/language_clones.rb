# Emits one detail page per supported language for every club and event.
#
# Every doc in _clubs/ and _events/ becomes:
#   /clubs/<slug>/        (English chrome, language: "en")
#   /de/clubs/<slug>/     (German chrome, language: "de")
#   /it/clubs/<slug>/     (Italian)
#   /fr/clubs/<slug>/     (French)
#   /es/clubs/<slug>/     (Spanish)
#   /pl/clubs/<slug>/     (Polish)
# and likewise /events/<slug>/ → /<lang>/events/<slug>/.
#
# The URL prefix sets the visitor's site language; the map/sidebar JS links to
# the matching language clone so navigation never flips lang. Body strings (day
# names, table labels) follow page.language to match the chrome.
#
# Pages has to deploy via GitHub Actions for this to run, since plugin
# generators aren't on the GitHub Pages whitelist.
#
# Set EN_ONLY=1 to skip the clones entirely (English pages only) — cuts the
# build from ~8,400 pages to ~1,400 for local styling/JS work:
#   EN_ONLY=1 bundle exec jekyll serve --incremental
# The /de/, /fr/, … club and event URLs will 404 while the flag is set.

module GameClub
  class LanguageClones < Jekyll::Generator
    safe true
    priority :low

    LANGUAGES = %w[de it fr es pl].freeze
    COLLECTIONS = %w[clubs events].freeze

    def generate(site)
      if ENV["EN_ONLY"] == "1"
        Jekyll.logger.info "LanguageClones:", "EN_ONLY=1 — skipping language clones"
        return
      end

      COLLECTIONS.each do |name|
        collection = site.collections[name]
        next unless collection

        originals = collection.docs.dup
        Jekyll.logger.info "LanguageClones:", "cloning #{originals.size} #{name} x #{LANGUAGES.size} languages"
        originals.each do |doc|
          LANGUAGES.each do |lang|
            collection.docs << LanguageClone.new(doc, lang, site, collection)
          end
        end
      end
    end
  end

  class LanguageClone < Jekyll::Document
    def initialize(source_doc, lang, site, collection)
      super(source_doc.path, site: site, collection: collection)
      read
      data["language"] = lang
      data["permalink"] = "/#{lang}#{source_doc.url}"
      @url = nil
    end
  end
end
