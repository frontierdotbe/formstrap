module Formstrap
  module Attachment
    extend ActiveSupport::Concern
    included do
      scope :not_a_variant, -> { where.not(record_type: "ActiveStorage::VariantRecord") }

      def record_hierarchy
        hierarchy = []

        current = record

        current, partial_hierarchy = process_fieldable(current)
        hierarchy << partial_hierarchy if partial_hierarchy.present?

        current, partial_hierarchy = process_blockable(current)

        hierarchy << partial_hierarchy if partial_hierarchy.present?

        hierarchy << current if current.present?

        hierarchy.flatten
      end

      private
      def process_blockable(field)
        field.respond_to?(:blockable) ? [field.blockable, field] : [field, nil]
      end

      def process_fieldable(field)
        field.respond_to?(:fieldable) ? [field.root.fieldable, field.self_and_ancestors] : [field, nil]
      end
    end
  end
end
