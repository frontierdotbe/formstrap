module Formstrap
  module Listable
    extend ActiveSupport::Concern

    included do
      def list
        datalist_id if @list
      end

      def datalist?
        @list.present?
      end

      def datalist_options
        {
          collection: @list,
          id: datalist_id
        }
      end

      def datalist_id
        "#{attribute}_list"
      end
    end
  end
end
