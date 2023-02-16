class Setting < ApplicationRecord
  # Configuration
  include Headmin::Fieldable

  # Validations
  validates :name, presence: true, length: {minimum: 4}
end
