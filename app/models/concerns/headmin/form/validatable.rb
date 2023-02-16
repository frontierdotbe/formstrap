module Headmin
  module Form
    module Validatable
      extend ActiveSupport::Concern

      included do
        def validation_options
          {
            id: validation_id,
            message: validation_message,
            valid: valid?
          }
        end

        def validate?
          form.object&.errors&.any?
        end

        private

        def valid?
          !form.object&.errors&.has_key?(attribute)
        end

        def validation_message
          form.object&.errors&.full_messages_for(attribute)&.join(", ")
        end

        def validation_id
          [attribute.to_s, "validation"].join("_").parameterize.underscore
        end

        def validation_class
          return unless validate?
          valid? ? "is-valid" : "is-invalid"
        end
      end
    end
  end
end
