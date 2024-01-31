module Formstrap
  module Attachment
    extend ActiveSupport::Concern
    included do
      scope :not_a_variant, -> { where.not(record_type: "ActiveStorage::VariantRecord") }

      def root_record
        record
      end

      def root_record_name
        "#{record.class.name} #{record.id}"
      end
    end
  end
end
