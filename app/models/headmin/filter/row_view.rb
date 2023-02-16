module Headmin
  module Filter
    class RowView < ViewModel
      def operator
        @operator || nil
      end

      def value
        @value || nil
      end
    end
  end
end
