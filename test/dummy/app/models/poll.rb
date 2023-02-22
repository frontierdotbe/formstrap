class Poll < ApplicationRecord
  extend Enumerize

  # Configuration
  acts_as_list
  enumerize :poll_type, in: [:general, :fun, :personal, :work]

  # Associations
  has_many :questions, dependent: :destroy
  has_one :survey
  accepts_nested_attributes_for :questions, allow_destroy: true

  def to_s
    name
  end

  def self.search(query)
    where("polls.name LIKE ?", "%#{query}%")
  end
end
