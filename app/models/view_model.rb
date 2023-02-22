# frozen_string_literal: true

class ViewModel
  # = View Model
  #
  # A View Model is a class that allows you to set an arbitrary hash of attributes and access all values by calling
  # attribute methods.
  #
  # ==== Examples
  #
  #   model = ViewModel.new(a: 1, b: {b1: 1, b2: 2}, c: 3)
  #
  #   model.a   # => 1
  #   model.b   # => {b1: 1, b2: 2}
  #   model.c   # => 3
  #
  # Reserved methods or attributes are left untouched. If you want to access an attribute that collides with a reserved
  # method, you can do it via the +to_hash+ method.
  #
  #   model = ViewModel.new(class: "test")
  #
  #   model.class             # => ViewModel
  #   model.to_hash[:class]   # => "test"

  def initialize(hash = {})
    hash.each do |key, value|
      instance_variable_set("@#{key}", value)
    end
  end

  def attributes
    instance_variables.map { |instance_variable| instance_variable.to_s.delete("@").to_sym }
  end

  def to_hash
    attributes.map { |attribute| {attribute => value_for(attribute)} }.inject(:merge) || {}
  end

  alias_method :to_h, :to_hash

  private

  def is_defined?(attribute)
    attributes.include?(attribute.to_sym)
  end

  def value_for(attribute)
    reserved_methods.include?(attribute) ? instance_variable_get("@#{attribute}") : send(attribute)
  end

  def method_missing(m, *args, &block)
    instance_variable_get("@#{m}")
  end

  def respond_to_missing?
    true
  end

  def reserved_methods
    Class.methods + Class.private_methods
  end
end
