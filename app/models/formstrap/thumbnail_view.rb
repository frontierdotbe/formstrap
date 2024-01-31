module Formstrap
  class ThumbnailView < ViewModel
    def class_names
      class_names = [@class]
      class_names << "img-thumbnail h-thumbnail"
      class_names.join(" ")
    end

    def width
      if is_defined?(:width)
        @width
      else
        @width || 100
      end
    end

    def height
      if is_defined?(:height)
        @height
      else
        @height || 100
      end
    end

    def blob
      file.is_a?(ActiveStorage::Blob) ? file : file&.blob
    end

    def mime_type
      blob&.content_type
    end

    def variant_options
      if width.nil? || height.nil?
        default_variant_options.merge({
          resize_to_fit: [width, height]
        })
      else
        default_variant_options.merge({
          resize_to_fill: [width, height, crop: :attention]
        })
      end
    end

    def default_variant_options
      {
        saver: {
          quality: 80
        }
      }
    end

    # Is it possible to create a ActiveStorage::Variant?
    def variable?
      blob&.variable?
    end

    def icon?
      is_defined?(:icon)
    end

    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    def icon_name
      return icon if icon
      type_map = {
        image: %w[image/bmp image/gif image/vnd.microsoft.icon image/jpeg image/png image/svg+xml image/tiff image/webp],
        play: %w[video/mp4 video/mpeg video/ogg video/mp2t video/webm video/3gpp video/3gpp2],
        music: %w[audio/aac audio/midi audio/x-midi audio/mpeg audio/ogg audio/opus audio/wav audio/webm audio/3gpp audio/3gpp2],
        word: %w[application/msword application/vnd.openxmlformats-officedocument.wordprocessingml.document],
        ppt: %w[application/vnd.ms-powerpoint application/vnd.openxmlformats-officedocument.presentationml.presentation],
        excel: %w[application/vnd.ms-excel application/vnd.openxmlformats-officedocument.spreadsheetml.sheet],
        slides: %w[application/vnd.oasis.opendocument.presentation],
        spreadsheet: %w[application/vnd.oasis.opendocument.spreadsheet],
        richtext: %w[application/vnd.oasis.opendocument.text],
        zip: %w[application/zip application/x-7z-compressed application/x-bzip application/x-bzip2 application/gzip application/vnd.rar],
        pdf: %w[application/pdf]
      }

      type = type_map.find { |key, mime_types| mime_types.include?(mime_type) }
      if type
        ["file", "earmark", type.first].compact.join("-")
      else
        "question"
      end
    end

    def svg?
      blob&.content_type == "image/svg+xml"
    end

    def inline_svg(options = {})
      blob.open do |file|
        content = file.read
        doc = Nokogiri::HTML::DocumentFragment.parse content
        svg = doc.at_css 'svg'

        # for security
        doc.search('script').each do |src|
          src.remove
        end

        options.each { |attr, value| svg[attr.to_s] = value }

        doc.to_html.html_safe
      end
    end
  end
end
