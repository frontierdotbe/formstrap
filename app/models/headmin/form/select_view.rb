module Headmin
  module Form
    class SelectView < ViewModel
      include Headmin::Form::Hintable
      include Headmin::Form::InputGroupable
      include Headmin::Form::Labelable
      include Headmin::Form::Listable
      include Headmin::Form::Placeholderable
      include Headmin::Form::Validatable
      include Headmin::Form::Wrappable

      def input_options
        keys = attributes - %i[append attribute collection float form input_group include_blank label prepend validate selected tags wrapper]
        options = to_h.slice(*keys)
        default_input_options.deep_merge(options)
      end

      def input_group_options
        default_input_group_options
          .deep_merge(label_input_group_options)
          .deep_merge(@input_group || {})
      end

      def wrapper_options
        default_wrapper_options.deep_merge({
          class: ["mb-3", ("form-floating" if float)]
        }).deep_merge(@wrapper || {})
      end

      def select_options
        keys = %i[include_blank selected]
        options = to_h.slice(*keys)
        default_options.deep_merge(options)
      end

      private

      def default_options
        selected = attribute.nil? ? nil : form.object&.send(attribute)
        {
          selected: selected
        }
      end

      def default_input_options
        {
          aria: {describedby: validation_id},
          class: [form_control_class, validation_class],
          data: {
            tags: tags,
            controller: "select"
          },
          multiple: tags,
          placeholder: placeholder
        }
      end

      def form_control_class
        plaintext ? "form-control-plaintext" : "form-select"
      end
    end
  end
end
