module Formstrap
  class WrapperView < ViewModel
    def options
      keys = attributes - %i[bypass]
      options = to_h.slice(*keys)
      default_options.deep_merge(options)
    end

    private

    def default_options
      {
        class: ["mb-3"]
      }
    end
  end
end
