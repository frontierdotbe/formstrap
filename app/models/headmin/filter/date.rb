module Headmin
  module Filter
    class Date < Headmin::Filter::Base
      OPERATORS = %w[eq not_eq gt gteq lt lteq between not_between in not_in is_null is_not_null]

      QUERY_OPERATOR_CONVERT_TO = {
        between: %w[eq],
        not_between: %w[not_eq]
      }

      OPERATORS_CONVERT_TO = {
        convert_to_range: %w[between not_between],
        convert_to_array: %w[in not_in],
        convert_to_value: %w[matches does_not_match is_null is_not_null starts_with ends_with],
        convert_to_datetime_equals: %w[eq not_eq],
        convert_to_datetime_begin: %w[lt gteq],
        convert_to_datetime_end: %w[gt lteq]
      }

      def cast_value(value)
        value.present? ? value.to_date : ::Date.current
      rescue
        raise TypeError, "The value that was passed to this filter is not a date"
      end

      def values
        @instructions.map { |instruction| output_value(instruction) }.compact
      end

      def output_value(instruction)
        if %w[eq not_eq].include?(instruction[:operator])
          instruction[:value].last.to_date
        elsif %w[lt lteq gt gteq].include?(instruction[:operator])
          instruction[:value].to_date
        else
          instruction[:value]
        end
      end

      def convert_to_datetime_equals(value)
        casted_date = cast_value(value)

        (casted_date - 1.day).end_of_day..casted_date.end_of_day
      end

      def convert_to_datetime_begin(value)
        casted_date = cast_value(value)
        casted_date.beginning_of_day
      end

      def convert_to_datetime_end(value)
        casted_date = cast_value(value)
        casted_date.end_of_day
      end

      def display_value(value)
        # This uses the default date format of headmin.
        # Can be overwritten by setting default date format of the application.

        current_operator = instructions.find { |instruction| instruction[:value] == value }[:operator]

        # To make the operators eq and not_eq work, we pass a range.
        # However, display value should return this as a date and not a range.
        if value.class.to_s == "Range" && (current_operator == "eq" || current_operator == "not_eq")
          I18n.l(value.last.to_date)
        elsif values.class.to_s
          "#{I18n.l(value.first.to_date)} - #{I18n.l(value.last.to_date)}"
        else
          I18n.l(value.to_date)
        end
      end
    end
  end
end
