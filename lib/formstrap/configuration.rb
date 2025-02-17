module Formstrap
  class Configuration
    attr_accessor :open_ai_key
    attr_accessor :ai

    def initialize
      @open_ai_key = ""
      @ai = false
    end
  end
end
