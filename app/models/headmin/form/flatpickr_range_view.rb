module Headmin
  module Form
    class FlatpickrRangeView < ViewModel
      include Headmin::Form::Hintable
      include Headmin::Form::InputGroupable
      include Headmin::Form::Labelable
      include Headmin::Form::Listable
      include Headmin::Form::Placeholderable
      include Headmin::Form::Validatable
      include Headmin::Form::Wrappable

      def attribute
        @attribute || :period
      end

      def start_attribute
        @start.dig(:attribute) || :start_date
      end

      def end_attribute
        @end.dig(:attribute) || :end_date
      end

      def start_options
        default_start_options.deep_merge(@start || {})
      end

      def end_options
        default_end_options.deep_merge(@end || {})
      end

      def input_options
        keys = attributes - %i[append attribute end float form input_group label prepend start validate wrapper]
        options = to_h.slice(*keys)
        default_input_options.deep_merge(options)
      end

      def input_group_options
        default_input_group_options
          .deep_merge(label_input_group_options)
          .deep_merge(@input_group || {})
      end

      def wrapper_options
        default_wrapper_options.deep_merge({
          class: ["mb-3", ("form-floating" if float)]
        }).deep_merge(@wrapper || {})
      end

      private

      def default_options
        {
          name: nil
        }
      end

      def default_start_options
        {}
      end

      def default_end_options
        {}
      end

      def default_input_options
        {
          aria: {describedby: validation_id},
          class: [form_control_class, validation_class],
          placeholder: placeholder,
          name: nil,
          data: {
            controller: "flatpickr date-range",
            action: "change->date-range#update",
            flatpickr: {
              mode: "range",
              defaultDate: [
                form.object&.send(start_attribute)&.strftime("%d/%m/%Y"),
                form.object&.send(end_attribute)&.strftime("%d/%m/%Y")
              ]
            }
          }
        }
      end

      def form_control_class
        plaintext ? "form-control-plaintext" : "form-control"
      end
    end
  end
end
