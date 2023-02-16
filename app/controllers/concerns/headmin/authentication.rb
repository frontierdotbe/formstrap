module Headmin
  module Authentication
    extend ActiveSupport::Concern

    included do
      before_action :authenticate_admin!
    end
  end
end
