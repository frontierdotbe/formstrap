module Headmin
  module Filter
    class BooleanView < FilterView
      def base_options
        keys = %i[name label form]
        options = to_h.slice(*keys)
        default_base_options.merge(options)
      end

      def input_options
        keys = %i[form]
        options = to_h.slice(*keys)
        default_input_options.merge(options)
      end

      private

      def value
        # If the value is nil we want to display the first option (which is true)
        @value.nil? ? @value = true : ""
      end

      def id
        "#{name}_value"
      end

      def name
        @name || attribute
      end

      def default_base_options
        {
          label: label,
          name: attribute,
          filter: Headmin::Filter::Boolean.new(name, @params),
          display_values: [[I18n.t("headmin.filters.values.true"), true], [I18n.t("headmin.filters.values.false"), false]],
          allowed_operators: Headmin::Filter::Boolean::OPERATORS
        }
      end

      def default_input_options
        {
          label: false,
          wrapper: false,
          id: id,
          name: nil,
          collection: [[I18n.t("headmin.filters.values.true"), 1], [I18n.t("headmin.filters.values.false"), 0]],
          selected: value ? 1 : 0,
          data: {
            action: "change->filter#updateHiddenValue",
            filter_target: "value",
            filter_row_target: "original"
          }
        }
      end
    end
  end
end
