module Formstrap
  class WysiwygView < ViewModel
    def options
      default_options.deep_merge(to_h)
    end

    private

    def default_options
      {
        hybrid: toolbar == false
      }
    end
  end
end
