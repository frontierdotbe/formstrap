module Formstrap
  class WysiwygView < ViewModel
    def options
      default_options.deep_merge(to_h)
    end

    private

    def toolbar
      @toolbar != false
    end

    def default_options
      options = {
        redactor: {
          context: !toolbar,
          extrabar: toolbar
        }
      }

      options[:redactor][:toolbar] = false if @toolbar == false

      options
    end
  end
end
