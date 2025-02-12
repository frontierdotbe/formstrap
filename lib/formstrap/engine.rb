require_relative "configuration"

module Formstrap
  class Engine < Rails::Engine
    engine_name "formstrap"

    # require "closure_tree"
    # require "redcarpet"
    # require "rouge"

    # Configuration
    mattr_accessor :configuration, default: Formstrap::Configuration.new

    def self.configure
      yield configuration if block_given?
    end
    
    # Add translations to main app
    config.before_configuration do
      config.i18n.load_path += Dir["#{config.root}/config/locales/**/*.yml"]
    end

    # Add assets to precompilation list
    initializer "formstrap.assets" do |app|
      next unless app.config.respond_to?(:assets)
      app.config.assets.precompile += %w[formstrap.js formstrap.css formstrap.scss]
    end
  end
end
