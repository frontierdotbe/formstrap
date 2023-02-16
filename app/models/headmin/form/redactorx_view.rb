module Headmin
  module Form
    class RedactorxView < ViewModel
      def options
        default_options.deep_merge(to_h)
      end

      private

      def default_options
        {
          data: {
            controller: "redactorx",
            "redactor-options": redactor_options
          }
        }
      end

      def control
        @control || (hybrid ? true : nil)
      end

      def context
        @context || (hybrid ? true : nil)
      end

      def toolbar
        @toolbar || (hybrid ? false : nil)
      end

      def addbar
        @addbar || %w[paragraph image embed table quote pre line]
      end

      def plugins
        @plugins || %w[shortcut]
      end

      attr_reader :topbar

      def redactor_options
        default_redactor_options.deep_merge(redactor || {})
      end

      def default_redactor_options
        {
          control: control,
          context: context,
          toolbar: toolbar,
          buttons: {
            addbar: addbar,
            plugins: plugins,
            topbar: topbar
          }
        }.delete_if { |k, v| v.nil? }
      end
    end
  end
end
