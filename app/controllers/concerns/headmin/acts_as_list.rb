module Headmin
  module ActsAsList
    def handle_positions(model:)
      position_params[:ids].each_with_index do |id, index|
        model.where(id: id).update_all(position: index + 1)
      end
      head :no_content
    end

    private

    def position_params
      params.permit(:locale, ids: [])
    end
  end
end
