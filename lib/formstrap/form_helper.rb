module Formstrap
  module FormHelper
    def formstrap_form_for(record, options = {}, &block)
      # ToDo: Can we pass info about the view here (e.g. host, protocol ...)
      options = options.reverse_merge({builder: Formstrap::FormBuilder})
      form_for(record, options, &block)
    end

    def formstrap_form_with(options = {}, &block)
      # ToDo: Can we pass info about the view here (e.g. host, protocol ...)
      options = options.reverse_merge({builder: Formstrap::FormBuilder})
      form_with(**options, &block)
    end
  end
end

ActiveSupport.on_load(:action_view) do
  include Formstrap::FormHelper
end
