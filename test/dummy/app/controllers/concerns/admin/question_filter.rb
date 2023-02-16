module Admin
  module QuestionFilter
    include Headmin::Filterable

    def filter(collection)
      filters = Headmin::Filters.new(params.slice(:title, :points, :created_at, :updated_at), {
        title: :text,
        points: :number,
        created_at: :date,
        updated_at: :date
      })

      filters.query(collection)
    end
  end
end
