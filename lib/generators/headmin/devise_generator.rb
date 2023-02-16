module Headmin
  class DeviseGenerator < Rails::Generators::Base
    include Rails::Generators::Migration

    source_root File.expand_path("../../templates", __FILE__)

    def copy_controllers
      directory "controllers/auth", "app/controllers/auth"
    end

    def copy_views
      directory "views/auth", "app/views/auth"
      copy_file "views/layouts/auth.html.erb", "app/views/layouts/auth.html.erb"
    end
  end
end
