module Headmin
  module Form
    class FlatpickrView < ViewModel
      def options
        keys = attributes - %i[data]
        options = to_h.slice(*keys)
        default_options.deep_merge(options)
      end

      private

      def default_options
        {
          data: default_data.deep_merge(data || {})
        }
      end

      def default_data
        {
          controller: "flatpickr",

          flatpickr: {
            defaultDate: attribute.nil? ? Date.today : form.object&.send(attribute)&.strftime("%d/%m/%Y")
          }
        }
      end
    end
  end
end
