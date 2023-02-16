module Headmin
  module Filter
    class ButtonView < ViewModel
      def id
        @id || SecureRandom.hex
      end

      def name
        @name.to_sym
      end

      def label
        @label || name.to_s.humanize
      end

      def display_values
        @display_values || []
      end

      def filter
        @filter || nil
      end
    end
  end
end
