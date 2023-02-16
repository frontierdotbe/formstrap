module Headmin
  module Filter
    class Association < Headmin::Filter::Base
      OPERATORS = %w[in not_in]

      def cast_value(value)
        is_i?(value) ? value.to_i : 0
      end

      def query(collection)
        return collection unless @instructions.any?

        # Store the collections' class for later use
        @parent_class = collection.is_a?(Class) ? collection : collection.klass

        # Join table if necessary
        collection = collection.joins(attribute) if has_many?

        # Build query and execute
        query = nil
        @instructions.each do |instruction|
          query = build_query(query, collection, instruction)
        end
        collection.where(query)
      end

      def build_query(query, collection, instruction)
        query_operator = convert_to_query_operator(instruction[:operator])
        query_value = convert_to_query_value(instruction[:value], instruction[:operator])
        query_operator, query_value = process_null_operators(query_operator, query_value)

        new_query = association_column.send(query_operator, query_value)

        query ? query.send(instruction[:conditional], new_query) : new_query
      end

      def display_value(value)
        if value.is_a? Array
          value.first.to_s
        else
          value
        end
      end

      def reflection
        @parent_class.reflect_on_association(attribute)
      end

      def macro
        reflection.macro
      end

      def association_class
        reflection.klass
      end

      def foreign_key
        reflection.foreign_key
      end

      def association_column
        if has_many?
          association_class.arel_table[:id]
        else
          @parent_class.arel_table[foreign_key]
        end
      end

      def has_many?
        macro == :has_many
      end
    end
  end
end
