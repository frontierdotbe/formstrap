module Formstrap
  class SearchView < ViewModel
    include Formstrap::Autocompletable
    include Formstrap::Hintable
    include Formstrap::InputGroupable
    include Formstrap::Labelable
    include Formstrap::Listable
    include Formstrap::Placeholderable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_options
      keys = attributes - %i[append attribute collection float form input_group label prepend validate wrapper]
      options = to_h.slice(*keys)
      options = default_input_options.deep_merge(options)
      options.deep_merge(autocomplete_input_options)
    end

    def input_group_options
      default_input_group_options
        .deep_merge(autocomplete_input_group_options)
        .deep_merge(label_input_group_options)
        .deep_merge(@input_group || {})
    end

    def wrapper_options
      default_wrapper_options.deep_merge({
        class: ["mb-3", ("form-floating" if float)]
      }).deep_merge(@wrapper || {})
    end

    private

    def default_input_options
      {
        aria: {describedby: validation_id},
        class: [form_control_class, validation_class],
        placeholder: placeholder
      }
    end

    def form_control_class
      plaintext ? "form-control-plaintext" : "form-control"
    end
  end
end
