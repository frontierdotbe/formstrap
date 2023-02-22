module Formstrap
  module InputGroupable
    extend ActiveSupport::Concern

    included do
      def input_group_options
        default_input_group_options.merge(@input_group || {})
      end

      private

      def default_input_group_options
        {
          bypass: !(prepend || append || @input_group),
          prepend: prepend,
          append: append
        }
      end
    end
  end
end
