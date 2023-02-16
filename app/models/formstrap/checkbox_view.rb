module Formstrap
  class CheckboxView < ViewModel
    include Formstrap::Hintable
    include Formstrap::Labelable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def checked_value
      @checked_value || "1"
    end

    def unchecked_value
      @unchecked_value || "0"
    end

    def input_options
      keys = attributes - %i[attribute form label validate wrapper checked_value unchecked_value]
      options = to_h.slice(*keys)
      default_input_options.deep_merge(options)
    end

    def label_options
      {
        class: ["form-check-label"],
        attribute: attribute,
        form: form,
        required: required,
        text: label
      }
    end

    def wrapper_options
      default_wrapper_options.deep_merge(
        {
          class: %w[form-check mb-3]
        }
      ).deep_merge(@wrapper || {})
    end

    private

    def default_input_options
      {
        aria: {describedby: validation_id},
        class: ["form-check-input", validation_class],
        placeholder: placeholder
      }
    end
  end
end
