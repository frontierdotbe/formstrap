module Formstrap
  class HiddenView < ViewModel
    def input_options
      keys = attributes - %i[attribute form]
      to_h.slice(*keys)
    end
  end
end
