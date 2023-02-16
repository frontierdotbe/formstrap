class Admin::UsersController < AdminController
  include Headmin::Pagination
  include Headmin::Sortable
  include Admin::UserFilter

  def index
    @users = paginate(users)
    add_breadcrumb User.model_name.human(count: 2)
  end

  def show
    @user = User.find(params[:id])
    add_breadcrumb User.model_name.human(count: 2), admin_users_path
    add_breadcrumb @user
  end

  def new
    @user = User.new
    add_breadcrumb User.model_name.human(count: 2), admin_users_path
    add_breadcrumb t("admin.new")
  end

  def edit
    @user = User.find(params[:id])
    add_breadcrumb User.model_name.human(count: 2), admin_users_path
    add_breadcrumb @user, admin_user_path(@user)
    add_breadcrumb t("admin.edit")
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:notice] = t("admin.flash.created", name: @user.name)
      redirect_to admin_user_path(@user)
    else
      render :new
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      flash[:notice] = t("admin.flash.updated", name: @user.name)
      redirect_to admin_user_path(@user)
    else
      render :edit
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    flash[:notice] = t("admin.flash.destroyed", name: @user.name)
    redirect_to admin_users_path
  end

  def bulk_destroy
    flash[:notice] = t("admin.flash.destroyed_all", count: users.count, name: User.model_name.human(count: users.count))
    users.destroy_all
    redirect_back(fallback_location: admin_root_path)
  end

  private

  def users
    users = User
    users = filter(users)
    sort(users)
  end

  def user_params
    params.require(:user).permit(
      :id,
      :first_name,
      :last_name,
      :email,
      :skip_password_validation,
      :password,
      :password_confirmation,
      :avatar,
      :blocked,
      documents: [],
      avatar_attachment_attributes: [:id, :blob_id, :_destroy],
      documents_attachments_attributes: [:id, :blob_id, :_destroy]
    )
  end
end
