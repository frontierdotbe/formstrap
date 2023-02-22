module Formstrap
  class FileView < ViewModel
    include Formstrap::Hintable
    include Formstrap::InputGroupable
    include Formstrap::Labelable
    include Formstrap::Placeholderable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_options
      keys = attributes - %i[append attribute dropzone destroy form input_group label prepend preview validate wrapper]
      options = to_h.slice(*keys)
      options = default_input_options.deep_merge(options)
      options = options.deep_merge(required: false) if attachments.any?
      options
    end

    def input_group_options
      default_input_group_options
        .deep_merge(label_input_group_options)
        .deep_merge(@input_group || {})
    end

    def wrapper_options
      default_wrapper_options.deep_merge({
        class: ["mb-3 h-form-file", ("form-floating" if float)],
        data: {
          controller: ("file-preview" if preview)
        }
      }).deep_merge(@wrapper || {})
    end

    def preview
      @preview || dropzone
    end

    def destroy
      @destroy || false
    end

    def attached
      form.object&.send(attribute)
    end

    def attachments
      attached&.attachments || []
    end

    def number_of_files
      multiple ? 2 : 1
    end

    def nested_attribute
      attached.is_a?(ActiveStorage::Attached::Many) ? :"#{attribute}_attachments" : :"#{attribute}_attachment"
    end

    def dropzone_options
      if dropzone
        {
          class: ["h-dropzone", validation_class],
          data: {
            controller: "dropzone"
          }
        }
      else
        {
          class: validation_class
        }
      end
    end

    # def input_group_options
    #   {
    #     prepend: prepend,
    #     append: append,
    #     class: "h-form-file",
    #     data: {
    #       controller: "#{"file-preview" if preview} #{"dropzone" if dropzone}"
    #     }
    #   }
    # end

    private

    def default_input_options
      {
        aria: {describedby: validation_id},
        class: ["form-control", validation_class],
        placeholder: placeholder,
        data: preview_data
      }
    end

    def preview_data
      if preview
        {
          "file-preview-target": "input",
          "dropzone-target": "input",
          action: "change->file-preview#preview dropEnd->file-preview#preview"
        }
      else
        {}
      end
    end
  end
end
