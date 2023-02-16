class Admin::PollsController < AdminController
  include Headmin::Pagination
  include Headmin::Sortable
  include Headmin::ActsAsList
  include Headmin::Filterable

  def index
    @polls = paginate(polls)

    add_breadcrumb Poll.model_name.human(count: 2)
  end

  def show
    @poll = Poll.find(params[:id])
    add_breadcrumb Poll.model_name.human(count: 2), admin_polls_path
    add_breadcrumb @poll.name
  end

  def update
    @poll = Poll.find(params[:id])
    if @poll.update(poll_params)
      flash[:notice] = t("admin.flash.updated", name: @poll)
      redirect_to admin_poll_path(@poll)
    else
      render :edit
    end
  end

  def new
    @poll = Poll.new
    add_breadcrumb Poll.model_name.human(count: 2), admin_polls_path
    add_breadcrumb t("admin.new")
  end

  def create
    @poll = Poll.new(poll_params)
    if @poll.save
      flash[:notice] = t("admin.flash.created", name: @poll)
      redirect_to admin_poll_path(@poll)
    else
      render :new
    end
  end

  def destroy
    @poll = Poll.find(params[:id])
    @poll.destroy
    flash[:notice] = t("admin.flash.destroyed", name: @poll)
    redirect_to admin_polls_path
  end

  def bulk_flash
    flash[:notice] = t("admin.flash.flashed_all", count: polls.count, name: Poll.model_name.human(count: polls.count))
    redirect_back(fallback_location: admin_root_path)
  end

  def bulk_export
    @polls = polls.all
    flash[:notice] = t("admin.flash.exported_all", count: polls.count, name: Poll.model_name.human(count: polls.count))
    render xlsx: "export.xlsx", filename: "polls.xlsx"
  end

  def bulk_destroy
    flash[:notice] = t("admin.flash.destroyed_all", count: polls.count, name: Poll.model_name.human(count: polls.count))
    polls.destroy_all
    redirect_back(fallback_location: admin_root_path)
  end

  def positions
    handle_positions(model: Poll)
  end

  private

  def polls
    polls = Poll.all
    polls = filter(polls, filter_types)
    polls = polls.order(position: :asc)
    sort(polls)
  end

  def poll_params
    params.require(:poll).permit!
  end

  def filter_types
    {
      questions: {
        title: :text,
        points: :number,
        created_at: :date
      },
      questions_count: :association_count,
      survey_count: :association_count,
      name: :text,
      end_date: :date,
      created_at: :date,
      digital: :boolean,
      poll_type: :text
    }
  end
end
