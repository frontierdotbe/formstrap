class Page < ApplicationRecord
  # Configuration
  include Headmin::Blockable

  # Associations
  belongs_to :parent, class_name: "Page", optional: true

  def self.search(query)
    where("pages.title LIKE ?", "%#{query}%")
      .or(Page.where("pages.handle LIKE ?", "%#{query}%"))
  end

  def to_s
    title
  end
end
