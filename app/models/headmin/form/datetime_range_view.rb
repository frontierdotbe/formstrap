module Headmin
  module Form
    class DatetimeRangeView < ViewModel
      def start_options
        default_start_options.deep_merge(@start || {})
      end

      def end_options
        default_end_options.deep_merge(@end || {})
      end

      private

      def default_start_options
        keys = attributes - %i[start]
        to_h.slice(*keys)
      end

      def default_end_options
        keys = attributes - %i[end]
        to_h.slice(*keys)
      end
    end
  end
end
