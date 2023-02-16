module Headmin
  module FormHelper
    # Outputs currently present query parameters as hidden fields for a given form
    #
    # https://example.com/products?amount=1&type[]=food&type[]=beverage
    #
    # <%= form.hidden_input :amount, value: 1 %>
    # <%= form.hidden_input :"type[]", value: "food" %>
    # <%= form.hidden_input :"type[]", value: "beverage" %>
    def query_parameter_fields(form)
      test = request.query_parameters.map do |name, value|
        if value.is_a?(Array)
          value.map do |value_element|
            form.hidden_field "#{name}[]", value: value_element
          end.join
        else
          form.hidden_field name, value: value
        end
      end
      test.join.html_safe
    end
  end
end
