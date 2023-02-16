module Formstrap
  class Engine < Rails::Engine
    engine_name "formstrap"

    # require "closure_tree"
    # require "redcarpet"
    # require "rouge"

    # Add translations to main app
    config.before_configuration do
      config.i18n.load_path += Dir["#{config.root}/config/locales/**/*.yml"]
    end

    # Add assets to precompilation list
    initializer "formstrap.assets" do |app|
      next unless app.config.respond_to?(:assets)
      app.config.assets.precompile += %w[formstrap.js formstrap.css formstrap.scss]
    end

    # Add importmap to main app
    initializer "headmin.importmap", before: "importmap" do |app|
      next unless app.config.respond_to?(:importmap)
      app.config.importmap.paths << Engine.root.join("config/importmap.rb")
      app.config.importmap.cache_sweepers << Engine.root.join("app/assets/javascripts")
    end
  end
end
