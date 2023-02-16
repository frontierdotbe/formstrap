module Headmin
  module Form
    class BlocksView < ViewModel
      def repeater_options
        keys = %i[form attribute names label]
        options = to_h.slice(*keys)
        default_repeater_options.deep_merge(options)
      end

      def paths
        @paths || []
      end

      def prefixes
        paths + ["admin/blocks", "blocks", ""]
      end

      def badge_style(object)
        visible = object.visible?
        errors = object.errors.present?

        if !visible && !errors
          "bg-light text-secondary"
        elsif errors
          "bg-danger text-white"
        else
          "bg-light text-dark"
        end
      end

      private

      def default_repeater_options
        {
          attribute: "blocks",
          label: false,
          templates: names,
          row: {
            class: "repeater-row list-group-item pt-3"
          }
        }
      end
    end
  end
end
