class User < ApplicationRecord
  extend Enumerize

  # Configuration
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable, :lockable, :trackable
  enumerize :role, in: [:user, :admin]

  # Associations
  has_one_attached :avatar
  accepts_nested_attributes_for :avatar_attachment, allow_destroy: true

  has_many_attached :documents
  accepts_nested_attributes_for :documents_attachments, allow_destroy: true

  # Attributes
  attr_accessor :skip_password_validation

  # Scopes
  scope :sort_by_name, ->(order = :asc) { order(last_name: order) }

  def to_s
    name
  end

  def to_param
    id.to_s
  end

  def name
    [first_name, last_name].compact.join(" ")
  end

  # Checks whether a password is needed or not. For validations only.
  # Passwords are always required if it's a new record, or if the password
  # or confirmation are being set somewhere.
  def password_required?
    !skip_password_validation && (!persisted? || !password.nil? || !password_confirmation.nil?)
  end

  def self.search(query)
    where("users.first_name LIKE ?", "%#{query}%")
      .or(User.where("users.last_name LIKE ?", "%#{query}%"))
      .or(User.where("users.email LIKE ?", "%#{query}%"))
  end
end
