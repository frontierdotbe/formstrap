module Headmin
  module Filter
    class Text < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq in not_in matches does_not_match starts_with ends_with is_null is_not_null starts_with ends_with]

      def cast_value(value)
        value
      end

      def display_value(value)
        value.downcase
      end

      private

      def convert_to_ends(value)
        "%#{value}"
      end

      def convert_to_starts(value)
        "#{value}%"
      end
    end
  end
end
