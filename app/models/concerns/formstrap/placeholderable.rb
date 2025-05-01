module Formstrap
  module Placeholderable
    extend ActiveSupport::Concern

    included do
      def placeholder
        float ? @placeholder || attribute : @placeholder
      end
    end
  end
end
