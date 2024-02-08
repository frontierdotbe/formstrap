module Formstrap
  class MediaView < ViewModel
    include Rails.application.routes.url_helpers
    include Formstrap::Hintable
    include Formstrap::Labelable
    include Formstrap::Placeholderable
    include Formstrap::Validatable
    include Formstrap::Wrappable

    def input_group_options
      default_input_group_options
        .deep_merge(label_input_group_options)
        .deep_merge(@input_group || {})
    end

    def wrapper_options
      default_wrapper_options.deep_merge({
        class: ["mb-3", ("form-floating" if float)],
        data: {
          controller: "media",
          name: name,
          min: min,
          max: max,
          sort: sort,
          accept: accept,
          required: required.nil? ? 0 : required
        }
      }).deep_merge(@wrapper || {})
    end

    def item_options
      options = {
        sort: sort,
        url: modal_url,
      }

      # Don't pass width or height if it was not defined
      options = options.merge(width: width) if is_defined?(:width)
      options = options.merge(height: height) if is_defined?(:height)

      options
    end

    def custom_validation_options
      {
        form: form,
        attribute: attribute,
        min: min,
        max: max,
        accept: accept
      }
    end

    def thumbnail_options
      options = {
        icon: "plus"
      }

      # Don't pass width or height if it was not defined
      options = options.merge(width: width) unless is_defined?(:width)
      options = options.merge(height: height) unless is_defined?(:height)

      options
    end

    def association_object
      if attached.is_a?(ActiveStorage::Attached::Many)
        result = form.object.send(nested_attribute)

        # We sort the collection with ruby to prevent a new query to be made that would dispose of the objects in memory
        result = result.sort_by { |item| item.position } if sort
        result
      else
        form.object.send(nested_attribute)
      end
    end

    def attachments
      if attached.is_a?(ActiveStorage::Attached::Many)
        result = form.object.send(nested_attribute)

        # We sort the collection with ruby to prevent a new query to be made that would dispose of the objects in memory
        result = result.sort_by { |item| item.position } if sort
        result.to_a.compact
      else
        [form.object.send(nested_attribute)].compact
      end
    end

    def attached
      form.object.send(attribute)
    end

    def build_nested_attribute
      if attached.is_a?(ActiveStorage::Attached::Many)
        form.object.send(nested_attribute).build
      else
        form.object.send("build_#{nested_attribute}")
      end
    end

    def nested_attribute
      if attached.is_a?(ActiveStorage::Attached::Many)
        :"#{attribute}_attachments"
      else
        :"#{attribute}_attachment"
      end
    end

    def min
      if @required
        (@min.to_i < 1) ? 1 : @min.to_i
      else
        (@min.to_i < 1) ? 0 : @min.to_i
      end
    end

    def max
      if attached.is_a?(ActiveStorage::Attached::Many)
        @max
      else
        1
      end
    end

    def modal_url
      formstrap_media_path(name: name, ids: blob_ids, min: min, max: max, mimetype: accept, exclude_models: exclude_models)
    end

    def edit_modal_url(attachment)
      return nil unless edit_url.present? && attachment.persisted?
      edit_url.gsub(":id", attachment.id.to_s)
    end

    attr_reader :accept

    def required
      @required ? 1 : nil
    end

    def blob_ids
      attachments.map { |attachment| attachment.blob_id }
    end

    def name
      "#{attribute}_#{object_id}"
    end

    def sort
      @sort == true
    end
  end
end
