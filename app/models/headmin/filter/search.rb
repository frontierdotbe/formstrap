module Headmin
  module Filter
    class Search < Headmin::Filter::Base
      def query(collection)
        return collection unless @instructions.any?
        collection.search(raw_value)
      end

      def cast_value(value)
        value
      end

      def display_value(value)
        value.downcase
      end
    end
  end
end
