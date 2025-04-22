require_relative "formstrap/version"
require_relative "formstrap/engine"
require_relative "formstrap/configuration"

# Formstrap
require "formstrap/form_builder"
require "formstrap/form_helper"

# Load generators
Dir[File.join(__dir__, "generators", "**", "*_generator.rb")].each { |g| require g }

module Formstrap
  mattr_accessor :configuration, default: Formstrap::Configuration.new

  def self.configure
    yield configuration if block_given?
  end
end
