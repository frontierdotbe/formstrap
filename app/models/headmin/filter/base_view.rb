module Headmin
  module Filter
    class BaseView < ViewModel
      def menu_item_options
        keys = %i[name label]
        options = to_h.slice(*keys)
        default_menu_item_options.merge(options)
      end

      def filter_template_options
        keys = %i[name label]
        options = to_h.slice(*keys)
        default_filter_template_options.merge(options)
      end

      def filter_operator_options
        keys = %i[allowed_operators]
        options = to_h.slice(*keys)
        default_filter_operator_options.merge(options)
      end

      def filter_button_options
        keys = %i[name label display_values filter]
        options = to_h.slice(*keys)
        default_filter_button_options.merge(options)
      end

      def label
        @label || name.to_s.humanize
      end

      private

      def default_menu_item_options
        {
          name: nil,
          label: label
        }
      end

      def default_filter_template_options
        {
          name: nil,
          label: label
        }
      end

      def default_filter_operator_options
        {
          allowed_operators: []
        }
      end

      def default_filter_button_options
        {
          name: nil,
          label: label,
          display_values: [],
          filter: nil
        }
      end
    end
  end
end
