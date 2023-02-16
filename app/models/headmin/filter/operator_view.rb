module Headmin
  module Filter
    class OperatorView < ViewModel
      def allowed_operators
        @allowed_operators || []
      end

      def selected
        @selected || nil
      end

      def operator_symbol
        {
          eq: "&equals; #{I18n.t("headmin.filters.operators.eq")}",
          not_eq: "&ne; #{I18n.t("headmin.filters.operators.not_eq")}",
          gt: "&gt; #{I18n.t("headmin.filters.operators.gt")}",
          gteq: "&ge; #{I18n.t("headmin.filters.operators.gteq")}",
          lt: "&lt; #{I18n.t("headmin.filters.operators.lt")}",
          lteq: "&le; #{I18n.t("headmin.filters.operators.lteq")}",
          starts_with: "&sqsub; #{I18n.t("headmin.filters.operators.starts_with")}",
          ends_with: "&sqsup; #{I18n.t("headmin.filters.operators.ends_with")}",
          matches: "&approx; #{I18n.t("headmin.filters.operators.matches")}",
          does_not_match: "&napprox; #{I18n.t("headmin.filters.operators.does_not_match")}",
          is_null: "&#9675; #{I18n.t("headmin.filters.operators.is_null")}",
          is_not_null: "&#9679; #{I18n.t("headmin.filters.operators.is_not_null")}",
          in: "&ni; #{I18n.t("headmin.filters.operators.in")}",
          not_in: "&notni; #{I18n.t("headmin.filters.operators.not_in")}",
          between: "&harr; #{I18n.t("headmin.filters.operators.between")}",
          not_between: "&harrcir; #{I18n.t("headmin.filters.operators.not_between")}"
        }
      end
    end
  end
end
