class Post < ApplicationRecord
  # Validations
  validates :title, presence: true

  has_one_attached :image_1
end
