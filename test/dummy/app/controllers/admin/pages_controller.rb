class Admin::PagesController < AdminController
  include Headmin::Pagination
  include Headmin::Sortable
  include Admin::PageFilter

  def index
    @pages = paginate(pages)
    add_breadcrumb Page.model_name.human(count: 2)
  end

  def show
    @page = Page.find(params[:id])
    add_breadcrumb Page.model_name.human(count: 2), admin_pages_path
    add_breadcrumb @page.title
  end

  def update
    @page = Page.find(params[:id])
    if @page.update(page_params)
      flash[:notice] = t("admin.flash.updated", name: @page)
      redirect_to admin_page_path(@page)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def new
    @page = Page.new
    add_breadcrumb Page.model_name.human(count: 2), admin_pages_path
    add_breadcrumb t("admin.new")
  end

  def create
    @page = Page.new(page_params)
    if @page.save
      flash[:notice] = t("admin.flash.created", name: @page)
      redirect_to admin_page_path(@page)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    @page = Page.find(params[:id])
    @page.destroy
    flash[:notice] = t("admin.flash.destroyed", name: @page)
    redirect_to admin_pages_path
  end

  def bulk_destroy
    flash[:notice] = t("admin.flash.destroyed_all", count: pages.count, name: Page.model_name.human(count: pages.count))
    pages.destroy_all
    redirect_back(fallback_location: admin_root_path)
  end

  private

  def pages
    pages = Page.all
    pages = filter(pages)
    sort(pages)
  end

  def page_params
    params.require(:page).permit!
  end
end
