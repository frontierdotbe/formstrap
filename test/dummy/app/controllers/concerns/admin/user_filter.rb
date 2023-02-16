module Admin
  module UserFilter
    include Headmin::Filterable

    def filter(collection)
      filters = Headmin::Filters.new(params.slice(:role), {
        role: :text
      })

      filters.query(collection)
    end
  end
end
