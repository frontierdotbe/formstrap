module Headmin
  module Block
    extend ActiveSupport::Concern

    included do
      # Associations
      belongs_to :blockable, polymorphic: true, optional: true, touch: true

      # Validations
      validates :handle, uniqueness: {scope: :blockable_id}, allow_blank: true

      # Scopes
      scope :visible, -> { where("visible = true") }
    end
  end
end
