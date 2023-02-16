module Headmin
  module Form
    class TextareaView < ViewModel
      include Headmin::Form::Hintable
      include Headmin::Form::InputGroupable
      include Headmin::Form::Labelable
      include Headmin::Form::Placeholderable
      include Headmin::Form::Validatable
      include Headmin::Form::Wrappable

      def input_options
        keys = attributes - %i[attribute float form input_group label validate wrapper]
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
          class: ["mb-3", ("form-floating" if float)],
          data: {controller: :textarea}
        }).deep_merge(@wrapper || {})
      end

      private

      def default_input_options
        {
          aria: {describedby: validation_id},
          class: [form_control_class, validation_class],
          data: {
            textarea_target: :textarea,
            action: "input->textarea#update"
          },
          placeholder: placeholder
        }
      end

      def form_control_class
        plaintext ? "form-control-plaintext" : "form-control"
      end
    end
  end
end
