module Formstrap
  class SelectView < ViewModel
    include Formstrap::Hintable
    include Formstrap::InputGroupable
    include Formstrap::Labelable
    include Formstrap::Listable
    include Formstrap::Placeholderable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_options
      keys = attributes - %i[append attribute collection float form input_group include_blank label prepend validate selected tags wrapper remote]
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
      {
        selected: value
      }
    end

    def value
      attribute.nil? ? nil : form.object&.send(attribute)
    end

    def default_input_options
      {
        aria: {describedby: validation_id},
        class: [form_control_class, validation_class],
        data: {
          tags: tags,
          controller: "select",
          select_remote_url_value: remote&.dig(:url),
          select_remote_value_value: remote&.dig(:value) || "name",
          select_remote_label_value: remote&.dig(:label) || "id",
          select_remote_query_param_value: remote&.dig(:query_param) || "search"
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
