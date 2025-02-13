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
    ro = ai ? default_redactor_options.deep_merge(ai_redactor_options) : default_redactor_options
      ro.deep_merge(redactor || {})
    end

    def default_redactor_options
      {
        lang: I18n.locale,
        # button to control a block/line in the editor
        control: false,
        minHeight: "57px",
        theme: "light",
        # Popup when highlighting text
        context: false,
        popups: {
          # Options in addbar popup (press + button)
          addbar: %w[format bold italic deleted list table link embed],
          # Options in block/line popup
          control: [],
          # Options in format popup
          format: %w[text h1 h2 h3 h4]
        },
        block: {
          # Outline block/line in the editor
          outline: false
        },
        buttons: {
          # Options when highlighting text
          context: %w[bold underline italic],
          # Options in toolbar on the right
          extrabar: %w[],
          # Options in toolbar on the left
          toolbar: %w[format bold italic deleted list table link html ai-tools]
        },
        plugins: %w[emoji linkstyles ai]
      }.delete_if { |k, v| v.nil? }
    end

    def ai
      @ai.present? ? @ai : Formstrap::Engine.configuration.ai
    end

    def ai_redactor_options
      {
        ai: {
          items: {
            set: true,
            fix: { title: I18n.t("redactor.ai.fix"), command: 'ai.set', params: { prompt: 'Fix any grammatical or spelling mistakes' } },
            translate: { title: I18n.t("redactor.ai.translate"), command: 'ai.popupTranslate' }
          },
          translate: I18n.available_locales.map{|locale| I18n.t("languages.#{locale.to_s}")},
          text: {
            url: "/formstrap/ai",
            endpoint: "https://api.openai.com/v1/chat/completions",
            model: "gpt-4o",
            stream: false
          }
        }
      }            
    end
  end
end
