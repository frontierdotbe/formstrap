class Admin::SettingsController < AdminController
  include Headmin::Pagination
  include Headmin::Sortable

  def index
    @settings = paginate(settings)
    add_breadcrumb Setting.model_name.human(count: 2)
  end

  def show
    @setting = Setting.find(params[:id])
    add_breadcrumb Setting.model_name.human(count: 2), admin_settings_path
    add_breadcrumb @setting.name
  end

  def update
    @setting = Setting.find(params[:id])
    if @setting.update(setting_params)
      flash[:notice] = t("admin.flash.updated", name: @setting)
      redirect_to admin_setting_path(@setting)
    else
      render :edit
    end
  end

  def destroy
    @setting = Setting.find(params[:id])
    @setting.destroy
    flash[:notice] = t("admin.flash.destroyed", name: @setting)
    redirect_to admin_settings_path
  end

  private

  def settings
    settings = Setting
    sort(settings)
  end

  def setting_params
    params.require(:setting).permit!
  end
end
