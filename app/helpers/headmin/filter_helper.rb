module Headmin
  module FilterHelper
    def filter_param_exists?(name)
      filter_param(name).present?
    end

    def filter_param(name)
      return nil unless params.has_key?(name)
      if params[name].is_a?(Array)
        params[name].reject { |c| c.empty? }
      else
        params[name]
      end
    end
  end
end
