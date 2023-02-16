module Headmin
  module Form
    module Wrappable
      extend ActiveSupport::Concern

      included do
        def wrapper_options
          default_wrapper_options.merge(@wrapper || {})
        end

        private

        def default_wrapper_options
          {
            bypass: @wrapper == false
          }
        end
      end
    end
  end
end
