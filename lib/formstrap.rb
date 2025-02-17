require_relative "formstrap/version"
require_relative "formstrap/engine"
require_relative "formstrap/configuration"

# Formstrap
require "formstrap/form_builder"
require "formstrap/form_helper"

module Formstrap
  mattr_accessor :configuration, default: Formstrap::Configuration.new

  def self.configure
    yield configuration if block_given?
  end
end
