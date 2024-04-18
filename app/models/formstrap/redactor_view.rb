module Formstrap
  class RedactorView < ViewModel
    def options
      default_options.deep_merge(to_h)
    end

    private

    def default_options
      {
        data: {
          controller: "redactor",
          "redactor-options": redactor_options
        }
      }
    end

    def redactor_options
      default_redactor_options.deep_merge(redactor || {})
    end

    def default_redactor_options
      {
        lang: I18n.locale,
        # button to control a block/line in the editor
        control: false,
        minHeight: '57px',
        theme: "light",
        # Popup when highlighting text
        context: false,
        # Top toolbar
        toolbar: true,
        popups: {
          # Options in addbar popup (press + button)
          addbar: %w[format bold italic deleted list table link embed],
          # Options in block/line popup
          control: [],
          # Options in format popup
          format: %w[text h1 h2 h3 h4],
        },
        block: {
          # Outline block/line in the editor
          outline: false,
        },
        buttons: {
          # Options when highlighting text
          context: %w[bold underline italic],
          # Options in toolbar on the right
          extrabar: %w[html],
          # Options in toolbar on the left
          toolbar: %w[format bold italic deleted list table link embed],
        },
        plugins: %w[emoji]
      }.delete_if { |k, v| v.nil? }
    end
  end
end
