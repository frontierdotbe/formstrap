module Headmin
  module Filter
    class Field < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq matches does_not_match]

      def initialize(attribute, params, association: nil)
        @attribute = association ? "#{association}_#{attribute}".to_sym : attribute
        @attribute = "field_#{attribute}".to_sym
        @raw_value = params[@attribute]
        @association = association
        @instructions = []

        if params.key?(@attribute)
          parse(@raw_value)
        end
      end

      def cast_value(value)
        value
      end

      def display_value(value)
        value.downcase
      end

      def query(collection)
        return collection unless @instructions.any?

        query = nil

        @instructions.each do |instruction|
          query = build_query(query, collection, instruction)
        end

        collection = collection.joins(:fields)
        collection.where(query)
      end

      def build_query(query, collection, instruction)
        query_operator = convert_to_query_operator(instruction[:operator])
        query_value = convert_to_query_value(instruction[:value], instruction[:operator])

        query_operator, query_value = process_null_operators(query_operator, query_value)

        model = collection.is_a?(Class) ? collection : collection.model

        new_attribute = attribute.to_s.gsub("field_", "").to_sym
        fields_model = model.reflect_on_association(:fields).klass
        new_query = fields_model.arel_table[:name].matches(new_attribute).and(fields_model.arel_table[:value].send(query_operator, query_value))

        query ? query.send(instruction[:conditional], new_query) : new_query
      end
    end
  end
end
