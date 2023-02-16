module Headmin
  module Filter
    class Money < Headmin::Filter::Number
      def cast_value(value)
        super(value) * 100
      end

      def attribute
        "#{@attribute}_cents"
      end
    end
  end
end
