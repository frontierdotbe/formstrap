module Headmin
  module Filter
    class AssociationCountView < FilterView
      def base_options
        keys = %i[name label form]
        options = to_h.slice(*keys)
        default_base_options.merge(options)
      end

      def input_options
        keys = %i[form]
        options = to_h.slice(*keys)
        default_input_options.merge(options)
      end

      def collection
        @collection || association_model.all.map { |record| [record.to_s, record.id] }
      end

      def association_model
        reflection.klass
      end

      private

      def id
        "#{name}_value"
      end

      def name
        @name || attribute
      end

      def attribute
        "#{@association}_count"
      end

      def label
        @label || I18n.t("attributes.#{attribute}", default: "#{I18n.t("attributes.count")} #{association_model.model_name.human(count: collection? ? 2 : 1)}")
      end

      def reflection
        form.object.class.reflect_on_association(@association)
      end

      def collection?
        reflection.collection?
      end

      def default_base_options
        {
          label: label,
          name: attribute,
          display_values: collection,
          filter: Headmin::Filter::AssociationCount.new(name, @params),
          allowed_operators: Headmin::Filter::AssociationCount::OPERATORS
        }
      end

      def default_input_options
        {
          label: false,
          wrapper: false,
          name: nil,
          id: id,
          data: {
            action: "change->filter#updateHiddenValue",
            filter_target: "value",
            filter_row_target: "original"
          },
          collection: collection,
          selected: selected,
          class: "form-control"
        }
      end
    end
  end
end
