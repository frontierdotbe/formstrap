module Headmin
  module Filter
    class FlatpickrView < ViewModel
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
        @name || attribute
      end

      def label
        @label || I18n.t("attributes.#{attribute}", default: name.to_s)
      end

      def default_base_options
        {
          label: label,
          name: attribute,
          filter: Headmin::Filter::Date.new(name, @params),
          allowed_operators: Headmin::Filter::Date::OPERATORS - %w[in not_in between not_between]
        }
      end

      def default_input_options
        {
          label: false,
          wrapper: false,
          name: nil,
          id: id,
          data: {
            action: "change->filter#updateHiddenValue",
            filter_target: "value",
            filter_row_target: "original"
          },
          class: "form-control"
        }
      end
    end
  end
end
