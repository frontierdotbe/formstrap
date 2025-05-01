module Formstrap
  module Blob
    extend ActiveSupport::Concern

    included do
      class << self
        def search(query)
          where("active_storage_blobs.filename LIKE ?", "%#{query}%")
        end

        def not_attached_to_variant
          not_attached_to("ActiveStorage::VariantRecord")
        end

        def not_attached_to(arg)
          case arg
          when String
            record_types = [arg]
          when Class
            record_types = [arg.to_s]
          when Array
            record_types = arg.map(&:to_s)
          end

          left_outer_joins(:attachments)
            .where.not(active_storage_attachments: {record_type: record_types})
            .or(is_orphan)
        end

        def by_mimetypes_string(mimetype_string)
          return where({}) if mimetype_string.blank?
          by_mimetypes(mimetype_string.split(","))
        end

        private

        def is_orphan
          left_outer_joins(:attachments)
            .where(active_storage_attachments: {id: nil})
        end

        def by_mimetypes(mimetypes = [])
          results = self

          mimetypes.map.with_index do |mimetype, index|
            content_type = mimetype.tr("*", "%")
            query = where(arel_table[:content_type].matches(content_type))
            results = (index == 0) ? query : results.or(query)
          end

          results
        end
      end
    end
  end
end
