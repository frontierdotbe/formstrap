module Headmin
  module RequestHelper
    def current_url?(url)
      uri = URI(url)
      path = uri.path
      query_string = uri.query || ""
      matches_path = request.path.include?(path)
      matches_query = request.query_string.include?(query_string)
      matches_path && matches_query
    end

    def default_params
      params.select { |key, value| is_default_param?(key) }
    end

    def add_default_param_key(key)
      keys = default_param_keys || []
      keys.push(key)
      @default_param_keys = keys
    end

    def default_param_keys
      @default_param_keys ||= [:page, :start, :length, :per_page]
    end

    def is_default_param?(key)
      default_param_keys.include?(key.to_sym) || is_sort_param_key?(key)
    end

    def is_sort_param_key?(key)
      key.to_s.include?("sort_")
    end
  end
end
