class Admin::QuestionsController < AdminController
  include Headmin::Pagination
  include Headmin::Sortable
  include Headmin::ActsAsList
  include Admin::QuestionFilter

  def index
    @questions = paginate(questions)
    add_breadcrumb Question.model_name.human(count: 2)
  end

  def show
    @question = Question.find(params[:id])
    add_breadcrumb Question.model_name.human(count: 2), admin_questions_path
    add_breadcrumb @question.title
  end

  def update
    @question = Question.find(params[:id])
    if @question.update(question_params)
      flash[:notice] = t("admin.flash.updated", name: @question)
      redirect_to admin_question_path(@question)
    else
      render :edit
    end
  end

  def new
    @question = Question.new
    add_breadcrumb Question.model_name.human(count: 2), admin_questions_path
    add_breadcrumb t("admin.new")
  end

  def create
    @question = Question.new(question_params)
    if @question.save
      flash[:notice] = t("admin.flash.created", name: @question)
      redirect_to admin_question_path(@question)
    else
      render :new
    end
  end

  def destroy
    @question = Question.find(params[:id])
    @question.destroy
    flash[:notice] = t("admin.flash.destroyed", name: @question)
    redirect_to admin_questions_path
  end

  private

  def questions
    questions = Question.all
    questions = filter(questions)
    sort(questions)
  end

  def question_params
    params.require(:question).permit!
  end
end
