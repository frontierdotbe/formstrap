module Headmin
  module Blob
    extend ActiveSupport::Concern

    included do
      class << self
        def not_attached_to_variant
          left_outer_joins(:attachments)
            .where.not(active_storage_attachments: {record_type: "ActiveStorage::VariantRecord"})
            .or(is_orphan)
        end

        def is_orphan
          left_outer_joins(:attachments)
            .where(active_storage_attachments: {id: nil})
        end

        def by_mimetypes_string(mimetype_string)
          return where({}) if mimetype_string.blank?
          by_mimetypes(mimetype_string.split(","))
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
