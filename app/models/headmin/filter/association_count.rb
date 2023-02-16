module Headmin
  module Filter
    class AssociationCount < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq gt gteq lt lteq]

      def cast_value(value)
        is_i?(value) ? value.to_i : 0
      end

      def query(collection)
        return collection unless @instructions.any?

        # Store the collections' class for later use
        @parent_class = collection.is_a?(Class) ? collection : collection.klass

        # Join table and group on primary key if necessary
        collection = collection.left_joins(reflection.name).group(primary_key)

        # Build query and execute
        query = nil
        @instructions.each do |instruction|
          query = build_query(query, collection, instruction)
        end
        collection.having(query)
      end

      private

      def build_query(query, collection, instruction)
        query_operator = convert_to_query_operator(instruction[:operator])
        query_value = convert_to_query_value(instruction[:value], instruction[:operator])

        query_operator, query_value = process_null_operators(query_operator, query_value)
        new_query = reflection.klass.arel_table[reflection.foreign_key.to_sym].count.send(query_operator, query_value)
        query ? query.send(instruction[:conditional], new_query) : new_query
      end

      def reflection
        reflection = @parent_class.reflect_on_association(attribute.to_s.split("_")[0].to_sym)
        raise UnknownAssociation if reflection.nil?

        reflection
      end

      def primary_key
        "#{@parent_class.table_name}.#{@parent_class.primary_key}"
      end
    end
  end
end
