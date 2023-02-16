module Headmin
  module Filter
    class FieldView < FilterView
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

      def id
        "#{name}_value"
      end

      def name
        "field_#{@name}".to_sym || attribute
      end

      def default_base_options
        {
          label: label,
          name: "field_#{attribute}".to_sym,
          filter: Headmin::Filter::Field.new(attribute.to_s.to_sym, @params),
          allowed_operators: Headmin::Filter::Field::OPERATORS - %w[in not_in]
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
          }
        }
      end
    end
  end
end
