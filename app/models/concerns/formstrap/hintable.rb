module Formstrap
  module Hintable
    extend ActiveSupport::Concern

    included do
      def hint?
        hint.present?
      end

      def maxlength?
        maxlength.present?
      end

      def hint_options
        {
          content: hint,
          maxlength: maxlength
        }
      end
    end
  end
end
