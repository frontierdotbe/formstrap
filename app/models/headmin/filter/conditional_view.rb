module Headmin
  module Filter
    class ConditionalView < ViewModel
      def selected
        @selected ? "+#{@selected.to_s.upcase}+" : nil
      end

      def values
        {
          "+AND+": I18n.t("headmin.filters.filter.conditional.and"),
          "+OR+": I18n.t("headmin.filters.filter.conditional.or")
        }
      end
    end
  end
end
