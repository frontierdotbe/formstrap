module Headmin
  module Form
    class LabelView < ViewModel
      def form
        @form.object_id
      end

      def options
        keys = attributes - %i[attribute form text]
        options = to_h.slice(*keys)
        default_options.deep_merge(options)
      end

      private

      def default_options
        {
          class: "form-label",
          required: required
        }
      end
    end
  end
end
