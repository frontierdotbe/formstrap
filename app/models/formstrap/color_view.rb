module Formstrap
  class ColorView < ViewModel
    include Formstrap::Hintable
    include Formstrap::Labelable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_options
      keys = attributes - %i[attribute form label validate wrapper]
      options = to_h.slice(*keys)
      default_input_options.deep_merge(options)
    end

    def label_options
      {
        class: ["form-label"],
        attribute: attribute,
        form: form,
        required: required,
        text: label
      }
    end

    def value
      @form.object&.send(@attribute) || "#000000"
    end

    def wrapper_options
      default_wrapper_options.deep_merge(
        {}
      ).deep_merge(@wrapper || {})
    end

    private

    def default_input_options
      {
        aria: {describedby: validation_id},
        class: ["form-control form-control-color", validation_class],
        placeholder: placeholder,
        title: value
      }
    end
  end
end
