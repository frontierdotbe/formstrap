# lib/generators/my_engine/my_initializer/my_initializer_generator.rb
require 'rails/generators'

module Formstrap
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def create_initializer_file
        template "formstrap.rb", "config/initializers/formstrap.rb"
      end
    end
  end
end
