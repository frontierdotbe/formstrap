module Formstrap
  class FormBuilder < ActionView::Helpers::FormBuilder
    def initialize(object_name, object, template, options)
      super(object_name, object, template, options)

      custom_helpers_path = "app/views/formstrap/"
      @custom_helpers = Dir["#{custom_helpers_path}*.html.erb"].map { |item| item.gsub("#{custom_helpers_path}_", "").split(".").first.to_sym }
    end

    def association_field(attribute, options = {})
      render_input(:association, attribute, options)
    end

    def preview_button(value = nil, options = {}, &block)
      default_options = {
        data: {
          controller: "preview",
          "preview-url-value": options[:url]
        },
        type: nil
      }
      button value, default_options.deep_merge(options.except(:url)), &block
    end

    def checkbox(attribute, formstrap: true, **options)
      if formstrap
        render_input :checkbox, attribute, options
      else
        check_box attribute, options
      end
    end

    def color(attribute, formstrap: true, **options)
      if formstrap
        render_input :color, attribute, options
      else
        color_field attribute, options
      end
    end

    def date(attribute, formstrap: true, **options)
      if formstrap
        render_input :date, attribute, options
      else
        date_field attribute, options
      end
    end

    def date_range(attribute, options = {})
      render_input(:date_range, attribute, options)
    end

    def datetime(attribute, formstrap: true, **options)
      if formstrap
        render_input :datetime, attribute, options
      else
        datetime_field attribute, options
      end
    end

    def datetime_range(attribute, options = {})
      render_input(:datetime_range, attribute, options)
    end

    def email(attribute, formstrap: true, **options)
      if formstrap
        render_input :email, attribute, options
      else
        email_field attribute, options
      end
    end

    def file(attribute, formstrap: true, **options)
      if formstrap
        render_input :file, attribute, options
      else
        file_field attribute, options
      end
    end

    def flatpickr(attribute, options = {})
      render_input :flatpickr, attribute, options
    end

    def flatpickr_range(attribute, options = {})
      render_input :flatpickr_range, attribute, options
    end

    def hidden(attribute, formstrap: true, **options)
      if formstrap
        render_input :hidden, attribute, options
      else
        hidden_field attribute, options
      end
    end

    def media(attribute, options = {})
      render_input :media, attribute, options
    end

    def number(attribute, formstrap: true, **options)
      if formstrap
        render_input :number, attribute, options
      else
        number_field attribute, options
      end
    end

    def password(attribute, formstrap: true, **options)
      if formstrap
        render_input :password, attribute, options
      else
        password_field attribute, options
      end
    end

    def repeater_for(attribute, options = {}, &block)
      @template.render("formstrap/repeater", form: self, attribute: attribute, **options, &block)
    end

    def redactor(attribute, formstrap: true, **options)
      if formstrap
        render_input(:redactor, attribute, options)
      else
        text_area attribute, options
      end
    end

    def search(attribute, options = {})
      render_input(:search, attribute, options)
    end

    def select(attribute, formstrap: true, **options)
      if formstrap
        render_input(:select, attribute, options)
      else
        super(attribute, options[:choices], options[:options], options[:html_options])
      end
    end

    def switch(attribute, options = {})
      render_input(:switch, attribute, options)
    end

    def text(attribute, formstrap: true, **options)
      if formstrap
        render_input :text, attribute, options
      else
        text_field attribute, options
      end
    end

    def textarea(attribute, formstrap: true, **options)
      if formstrap
        render_input :textarea, attribute, options
      else
        text_area attribute, options
      end
    end

    def url(attribute, formstrap: true, **options)
      if formstrap
        render_input :url, attribute, options
      else
        url_field attribute, options
      end
    end

    def wysiwyg(attribute, formstrap: true, **options)
      if formstrap
        render_input(:wysiwyg, attribute, options)
      else
        text_area attribute, options
      end
    end

    def render_input(name, attribute, options)
      @template.render("formstrap/#{name}", form: self, attribute: attribute, **options)
    end

    def method_missing(name, *args, &block)
      attribute = args[0]
      options = (args.length >= 2) ? args[1] : {}

      render_input(name, attribute, options)
    end

    def respond_to_missing?(method_name, include_private = false)
      if @custom_helpers.include?(method_name)
        true
      end
    end
  end
end
