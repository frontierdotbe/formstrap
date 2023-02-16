module Headmin
  class Filters
    # Example:
    #
    # @orders = Headmin::Filters.new(params, {
    #   status: :text,
    #   price: :number,
    #   in_stock: :boolean
    # }).query(Order)

    def initialize(params, param_types)
      @params = params
      @param_types = param_types
    end

    def parse(attribute, type, association: nil)
      class_name = "Headmin::Filter::#{type.to_s.classify}".constantize
      class_name.new(attribute, @params, association: association)
    end

    def query(collection)
      @param_types.each do |attribute, type|
        if type.is_a? Hash
          # We are given attribute filters of an association
          association = attribute

          # By default, we offer a filter of type association
          association_filter = Headmin::Filter::Association.new(attribute, @params, association: nil)
          collection = association_filter.query(collection)

          # Query all the passed attribute filters for this association
          type.each do |new_attribute, new_type|
            filter = parse(new_attribute, new_type, association: association)
            collection = filter.query(collection)
          end
        else
          filter = parse(attribute, type)
          collection = filter.query(collection)
        end
      end
      collection
    end
  end
end
