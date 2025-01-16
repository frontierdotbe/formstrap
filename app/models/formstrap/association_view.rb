module Formstrap
  class AssociationView < ViewModel
    include Formstrap::Hintable
    include Formstrap::InputGroupable
    include Formstrap::Labelable
    include Formstrap::Listable
    include Formstrap::Placeholderable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_options
      keys = attributes - %i[append attribute collection float form input_group include_blank label prepend validate selected tags wrapper]
      options = to_h.slice(*keys)
      def_input_options = default_input_options
      def_input_options = def_input_options.deep_merge(options)
      def_input_options = def_input_options.merge({multiple: true}) if collection?
      def_input_options
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

    def attribute_with_id
      attribute_with_id = collection? ? "#{association_foreign_key}s" : foreign_key

      if attribute_with_id.nil?
        raise(AssociationDoesNotExistError, "Association attribute that was passed does not exist.")
      else
        attribute_with_id
      end
    end

    def collection
      if remote
        collection_for_values
      else
        association_class.all.map { |item| [item.to_s, item.id] }
      end
    end

    private

    def collection_for_values
      if collection?
        form.object.send(attribute).map { |item| option_for_item[item] }
      else
        [option_for_item(form.object.send(attribute))]
      end
    end

    def option_for_item(item)
      return unless item
      [item.send(remote[:label]), item.send(remote[:value])]
    end

    def association_foreign_key
      reflection.association_foreign_key
    end

    def foreign_key
      reflection.foreign_key
    end

    def reflection
      form.object.class.reflect_on_association(attribute)
    end

    def association_class
      reflection.klass
    end

    def collection?
      reflection.collection?
    end

    def default_options
      {
        selected: form.object&.send(attribute_with_id)
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
        remote: remote,
        multiple: tags,
        placeholder: placeholder
      }
    end

    def form_control_class
      plaintext ? "form-control-plaintext" : "form-select"
    end

    class AssociationDoesNotExistError < StandardError
    end
  end
end
