module Headmin
  module Blockable
    extend ActiveSupport::Concern

    included do
      has_many :blocks, as: :blockable, dependent: :destroy
      accepts_nested_attributes_for :blocks, allow_destroy: true
    end
  end
end
