class Post < ApplicationRecord
  # Validations
  validates :title, presence: true
end
