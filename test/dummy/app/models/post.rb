class Post < ApplicationRecord
  include Headmin::Blockable

  # Validations
  validates :title, presence: true
end
