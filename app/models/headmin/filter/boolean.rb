module Headmin
  module Filter
    class Boolean < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq is_null is_not_null]

      def cast_value(value)
        ActiveModel::Type::Boolean.new.cast(value)
      end

      def to_s
        string
      end
    end
  end
end
