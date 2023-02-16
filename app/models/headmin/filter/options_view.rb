module Headmin
  module Filter
    class OptionsView < FilterView
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

      def collection
        @collection || []
      end

      private

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
          display_values: collection,
          filter: Headmin::Filter::Text.new(name, @params),
          allowed_operators: Headmin::Filter::Text::OPERATORS - %w[starts_with ends_with in not_in]
        }
      end

      def default_input_options
        {
          label: false,
          wrapper: false,
          id: id,
          name: nil,
          data: {
            action: "change->filter#updateHiddenValue",
            filter_target: "value",
            filter_row_target: "original"
          },
          collection: collection,
          selected: selected,
          class: "form-select"
        }
      end
    end
  end
end
