module Formstrap
  class MediaItemView < ViewModel
    include Rails.application.routes.url_helpers

    def thumbnail_options
      options = {
        file: attachment
      }

      # Don't pass width or height if it was not defined
      options = options.merge(width: width) if is_defined?(:width)
      options = options.merge(height: height) if is_defined?(:height)

      options
    end

    def attachment
      form.object
    end

    def position_value
      attachment.new_record? ? nil : attachment.position
    end

    def id
      attachment.blob ? attachment.blob.id : "$1"
    end

    def filename
      attachment.blob&.filename&.to_s
    end

    def content_type
      attachment.blob&.content_type
    end

    def size
      number_to_human_size(attachment.blob&.byte_size || 0)
    end
  end
end
