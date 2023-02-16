class Question < ApplicationRecord
  # Associations
  belongs_to :poll

  def to_s
    title
  end
end
