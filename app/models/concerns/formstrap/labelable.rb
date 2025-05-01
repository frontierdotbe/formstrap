module Formstrap
  module Labelable
    extend ActiveSupport::Concern
    included do
      def label?
        label != false
      end

      def prepend_label?
        label != false && !float
      end

      def append_label?
        label != false && float
      end

      def label_input_group_options
        float ? {bypass: true} : {}
      end

      def label_options
        {
          attribute: attribute,
          form: form,
          required: required,
          text: label,
          translatable: translatable
        }
      end
    end
  end
end
