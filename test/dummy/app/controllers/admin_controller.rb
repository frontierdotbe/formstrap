class AdminController < ApplicationController
  before_action :authenticate_user!, :authorize

  def authorize
    head :forbidden unless current_user.role == "admin"
  end
end
