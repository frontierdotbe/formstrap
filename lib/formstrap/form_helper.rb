module Formstrap
  module FormHelper
    def formstrap_form_for(record, options = {}, &block)
      options = options.reverse_merge({builder: Formstrap::FormBuilder})
      form_for(record, options, &block)
    end

    def formstrap_form_with(options = {}, &block)
      options = options.reverse_merge({builder: Formstrap::FormBuilder})
      form_with(**options, &block)
    end
  end
end

ActiveSupport.on_load(:action_view) do
  include Formstrap::FormHelper
end
