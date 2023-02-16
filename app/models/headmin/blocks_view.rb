module Headmin
  class BlocksView < ViewModel
    def show_blocks?
      blockable&.respond_to?(:blocks)
    end

    def paths
      @paths || []
    end

    def prefixes
      paths + ["website/blocks", "blocks"]
    end
  end
end
