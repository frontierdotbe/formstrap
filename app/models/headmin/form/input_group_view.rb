module Headmin
  module Form
    class InputGroupView < ViewModel
      def options
        keys = attributes - %i[bypass append prepend]
        options = to_h.slice(*keys)
        default_options.deep_merge(options)
      end

      private

      def default_options
        {
          class: ["input-group"]
        }
      end
    end
  end
end
