module Headmin
  module Filter
    class Number < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq gt gteq lt lteq between not_between in not_in is_null is_not_null]

      def cast_value(value)
        is_i?(value) ? value.to_i : 0
      end

      def to_s
        string
      end
    end
  end
end
