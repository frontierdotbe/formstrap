module Formstrap
  class SwitchView < ViewModel
    def options
      default_options.deep_merge(to_h)
    end

    private

    def default_options
      {
        wrapper: default_wrapper_options
      }
    end

    def default_wrapper_options
      {
        class: %w[form-check form-switch mb-3]
      }
    end
  end
end
