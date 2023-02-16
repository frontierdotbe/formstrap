module Headmin
  class FieldsGenerator < Rails::Generators::Base
    include Rails::Generators::Migration

    source_root File.expand_path("../../templates", __FILE__)

    def copy_models
      template "models/field.rb", "app/models/field.rb"
    end

    def copy_migrations
      migration_template "migrations/create_fields.rb", "db/migrate/create_fields.rb"
      migration_template "migrations/create_field_hierarchies.rb", "db/migrate/create_field_hierarchies.rb"
    end

    class << self
      def next_migration_number(dirname)
        next_migration_number = current_migration_number(dirname) + 1
        ActiveRecord::Migration.next_migration_number(next_migration_number)
      end
    end
  end
end
