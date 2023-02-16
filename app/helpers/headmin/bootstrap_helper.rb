module Headmin
  module BootstrapHelper
    def bootstrap_icon(icon, options = {})
      tag_name = options.extract!(:tag_name).fetch(:tag_name, :i)
      options[:class] = ["bi", "bi-#{icon}", options.dig(:class)].compact.join(" ")
      content_tag(tag_name, options) {}
    end
  end
end
