module Admin
  module PageFilter
    include Headmin::Filterable

    def filter(collection)
      filters = Headmin::Filters.new(params.slice(:parent), {
        parent: :association
      })

      filters.query(collection)
    end
  end
end
