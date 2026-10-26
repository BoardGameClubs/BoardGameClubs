require "jekyll-seo-tag"

# jekyll-seo-tag only reads `page.image`, so without this most pages share no
# image, and club/event logos (bare filenames like "foo.png") resolve relative
# to the page URL instead of their assets/images/<collection>/ folder.
module GameClubSeoImage
  private

  def image_hash
    @image_hash ||= begin
      image = page["image"]
      collection = page["collection"]
      if image.nil? || image.to_s.strip.empty?
        site = context.registers[:site]
        {
          "path"   => site.config["og_image"],
          "width"  => 1200,
          "height" => 630,
          "alt"    => site.config["title"]
        }
      elsif image.is_a?(String) && %w[clubs events].include?(collection) &&
            !image.include?("://") && !image.start_with?("/")
        { "path" => "/assets/images/#{collection}/#{image}" }
      else
        super
      end
    end
  end
end

Jekyll::SeoTag::ImageDrop.prepend(GameClubSeoImage)
