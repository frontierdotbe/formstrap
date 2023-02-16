class Website::PagesController < WebsiteController
  def show
    @page = Page.find_by!(slug: params[:slug])
  end
end
