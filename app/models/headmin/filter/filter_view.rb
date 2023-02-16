module Headmin
  module Filter
    class FilterView < ViewModel
      def attribute
        @association ? "#{@association}_#{@attribute}".to_sym : @attribute
      end

      def label
        @label || I18n.t("attributes.#{attribute}", default: @association ? "#{association_model.model_name.human(count: 1)} - #{association_model.human_attribute_name(@attribute)}" : name.to_s)
      end

      def reflection
        if @association
          form.object.class.reflect_on_association(@association)
        end
      end

      def association_model
        if @association
          reflection.klass
        end
      end
    end
  end
end
