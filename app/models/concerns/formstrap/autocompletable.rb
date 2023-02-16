module Formstrap
  module Autocompletable
    extend ActiveSupport::Concern

    included do
      def autocomplete?
        collection.is_a?(String) || collection.is_a?(Array)
      end

      def autocomplete_options
        {
          collection: collection.is_a?(Array) ? collection : []
        }
      end

      def autocomplete_input_options
        {
          data: {
            autocomplete_target: autocomplete? ? "input" : nil
          }
        }
      end

      def autocomplete_input_group_options
        options = {
          data: {
            controller: autocomplete? ? "autocomplete" : nil,
            autocomplete_url_value: collection.is_a?(String) ? collection : nil
          }
        }
        options = options.merge(bypass: false) if autocomplete?
        options
      end
    end
  end
end
