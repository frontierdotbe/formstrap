module Headmin
  module Filter
    class SearchView < ViewModel
      def input_options
        keys = attributes - %i[params]
        options = to_h.slice(*keys)
        options = default_input_options.merge(options)
        options.merge(label: false)
      end

      private

      def default_input_options
        {
          name: name,
          value: params[name],
          wrapper: false,
          placeholder: placeholder
        }
      end

      def name
        @name || attribute || :search
      end

      def placeholder
        @placeholder || I18n.t("headmin.filters.search.placeholder", resource: label)
      end
    end
  end
end
