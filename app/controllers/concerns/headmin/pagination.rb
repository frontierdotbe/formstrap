module Headmin
  module Pagination
    def paginate(collection)
      @records_filtered = collection.count
      if collection.is_a?(Array)
        Kaminari.paginate_array(collection).page(page).per(per_page)
      else
        collection.page(page).per(per_page)
      end
    end

    def page
      if params[:page]
        params[:page]
      elsif params[:start]
        (params[:start].to_i / per_page) + 1
      else
        1
      end
    end

    def per_page
      length = params[:per_page].to_i
      (length > 0) ? length : 24
    end
  end
end
