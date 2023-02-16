module Headmin
  module Sortable
    def sort(collection)
      if sort_params.to_h.any?
        sort_by_params(collection)
      elsif collection.attribute_names.include?(:created_at.to_s)
        collection.order(created_at: :desc)
      else
        collection
      end
    end

    def sort_by_params(collection)
      sort_params.each do |key, value|
        next unless %w[asc desc].include?(value)
        attribute = key.gsub("sort_", "")

        # Sort on model columns first, then check for translation columns
        if collection.attribute_names.include?(attribute.to_s)
          column = collection.arel_table[attribute]
        elsif collection.respond_to?(:translation_class) && collection.translation_class.attribute_names.include?(attribute.to_s)
          column = collection.translation_class.arel_table[attribute]
        else
          next
        end

        order_scope = "order_by_#{attribute}".to_sym
        sort_scope = "sort_by_#{attribute}".to_sym
        collection = if collection.respond_to?(order_scope)
          collection.send(order_scope, value)
        elsif collection.respond_to?(sort_scope)
          collection.send(sort_scope, value)
        else
          collection.order(column.send(value))
        end
      end
      collection
    end

    def sort_params
      params.permit!.select { |p| p.to_s.include?("sort_") }
    end
  end
end
