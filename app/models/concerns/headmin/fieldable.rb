module Headmin
  module Fieldable
    extend ActiveSupport::Concern

    included do
      has_many :fields, as: :fieldable, dependent: :destroy
      accepts_nested_attributes_for :fields, allow_destroy: true

      # Callbacks
      before_validation :build_fields

      def fields_hash
        @fields_hash ||= parse_fields
      end

      def fields_hash=(hash)
        @fields_hash = hash
      end

      def include_tables
        []
      end

      def default_include_tables
        [files_attachments: :blob]
      end

      private

      def parse_fields
        hash_tree = {}
        fields.roots.includes(default_include_tables | include_tables).each do |field|
          field.hash_tree.map { |key, value| hash_tree[key] = value }
        end
        parse_hash_tree(hash_tree)
      end

      def build_fields
        return unless @fields_hash
        self.fields = fields_for(@fields_hash)
      end

      def fields_for(hash)
        hash.map do |key, value|
          case value
          when Hash
            field_for_hash(key, value)
          when Array
            field_for_array(key, value)
          when File
            field_for_file(key, value)
          else
            field_for_string(key, value)
          end
        end
      end

      def field_for_hash(name, hash)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "group",
          fields: fields_for(hash)
        )
      end

      def field_for_array(name, array)
        if array.all? { |item| item.is_a?(File) }
          field_for_files(name, array)
        elsif array.all? { |item| item.is_a?(Hash) }
          field_for_group_list(name, array)
        else
          field_for_simple_list(name, array)
        end
      end

      def field_for_simple_list(name, array)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "list",
          fields: array.map { |item| fields_for({item: item}) }.flatten
        )
      end

      def field_for_group_list(name, array)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "list",
          fields: array.map { |item| ::Field.new(fieldable: self, field_type: :list_item, fields: fields_for(item)) }
        )
      end

      def field_for_string(name, string)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "text",
          value: string
        )
      end

      def field_for_file(name, file)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "file",
          value: nil,
          files_attachments_attributes: [
            {
              blob: ActiveStorage::Blob.create_and_upload!(io: file, filename: File.basename(file.path))
            }
          ]
        )
      end

      def field_for_files(name, files)
        ::Field.new(
          fieldable: self,
          name: name,
          field_type: "files",
          value: nil,
          files_attachments_attributes: files.map { |file|
            {
              blob: ActiveStorage::Blob.create_and_upload!(io: file, filename: File.basename(file.path))
            }
          }
        )
      end

      # From hash tree to hash
      def parse_hash_tree(hash_tree)
        new_hash = {}
        hash_tree.each do |field, children|
          new_hash[field.name.to_sym] = parse_field(field, children)
        end
        new_hash
      end

      # Parse value for given field
      def parse_field(field, children)
        case field.field_type.to_sym
        when :group
          parse_group_field(field, children)
        when :list_item
          parse_list_item_field(field, children)
        when :list
          parse_list_field(field, children)
        when :files
          parse_files_field(field)
        when :file
          parse_file_field(field)
        else
          parse_text_field(field)
        end
      end

      def parse_group_field(field, children)
        parse_hash_tree(children)
      end

      def parse_list_item_field(field, children)
        parse_hash_tree(children)
      end

      def parse_list_field(field, children)
        children.map do |child, grand_children|
          parse_field(child, grand_children)
        end
      end

      def parse_files_field(field)
        files = field.files
        files = files.order(:position) if ActiveStorage::Attachment.column_names.include?("position")
        files
      end

      def parse_file_field(field)
        field.files.last
      end

      def parse_text_field(field)
        field.value
      end
    end
  end
end
