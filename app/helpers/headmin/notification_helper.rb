module Headmin
  module NotificationHelper
    def notification_color(name)
      color = {
        notice: {
          background: "bg-success",
          text: "text-white"
        },
        error: {
          text: "text-dark",
          background: "bg-danger"
        },
        alert: {
          text: "text-dark",
          background: "bg-warning"
        },
        timedout: {
          text: "text-dark",
          background: "bg-warning"
        },
        fallback: {
          text: "text-light",
          background: "bg-info"
        }
      }

      name = name.to_sym
      color.key?(name) ? color[name] : color[:fallback]
    end
  end
end
