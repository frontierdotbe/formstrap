module Headmin
  module Filterable
    # Will create a Headmin::Filters object with a default configuration for "id" and "search"
    #
    # Example:
    #
    # orders = Order
    # orders = filter(orders, {
    #  status: :text,
    #  price: :number,
    #  in_stock: :boolean
    #  })
    # @orders = orders.all

    def filter(collection, filter_types = {})
      type_hash = default_filter_types.merge(filter_types)
      Headmin::Filters.new(params, type_hash).query(collection)
    end

    def default_filter_types
      {
        id: :number,
        search: :search
      }
    end
  end
end
