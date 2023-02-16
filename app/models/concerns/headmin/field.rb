module Headmin
  module Field
    extend ActiveSupport::Concern

    included do
      # Configuration
      has_closure_tree order: "position", numeric_order: true, dependent: :destroy

      # Associations
      belongs_to :fieldable, polymorphic: true, optional: true, touch: true
      belongs_to :field, optional: true, touch: true
      has_many :fields, foreign_key: "parent_id"
      accepts_nested_attributes_for :fields, allow_destroy: true

      # field_type: :files, :file
      has_many_attached :files, dependent: :detach
      accepts_nested_attributes_for :files_attachments, allow_destroy: true
    end
  end
end
