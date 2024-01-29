class Formstrap::MediaController < FormstrapController
  include Formstrap::Pagination
  layout false

  def index
    blobs = ActiveStorage::Blob
    blobs = filter(blobs)
    blobs = sort(blobs)
    blobs = blobs.group(:id)
    @blobs = paginate(blobs)
    @mimetypes = media_params[:mimetype]

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def create
    blobs = []
    media_params[:files].reject { |c| c.blank? }.each do |file|
      blobs << ActiveStorage::Blob.create_and_upload!(io: file, filename: file.original_filename)
    end

    respond_to do |format|
      format.turbo_stream {
        @blobs = blobs
      }
      format.html { redirect_to root_path }
    end
  end

  def show
    @blob = ActiveStorage::Blob.find(params[:id])
  end

  def update
    @blob = ActiveStorage::Blob.find(params[:id])
    media_item_params[:filename] = media_item_params[:filename] + "." + @blob.filename.to_s.rpartition(".").last
    if @blob.update(media_item_params)
      flash.now[:notice] = t("admin.flash.updated", name: @blob.filename)
    end
  end

  def thumbnail
    @blob = ActiveStorage::Blob.find(params[:id])
  end

  private

  def filter(blobs)
    blobs = filter_unattached(blobs)
    blobs = filter_by_mimetype(blobs, media_params[:mimetype]) if media_params[:mimetype].present?
    blobs = filter_excluded_models(blobs, media_params[:exclude_models]) if media_params[:exclude_models].present?
    blobs = filter_search(blobs, media_params[:search]) if media_params[:search].present?
    blobs
  end

  def filter_unattached(blobs)
    blobs.not_attached_to_variant
  end

  def filter_by_mimetype(blobs, mimetype)
    blobs.by_mimetypes_string(mimetype)
  end

  def filter_excluded_models(blobs, model_names = [])
    blobs.not_attached_to(model_names)
  end

  def filter_search(blobs, string)
    blobs.search(string)
  end

  def sort(blobs)
    blobs.order(created_at: :desc)
  end

  def media_params
    params.permit(
      :max,
      :mimetype,
      :min,
      :name,
      :search,
      :page,
      :page_start,
      :per_page,
      ids: [],
      files: [],
      exclude_models: []
    )
  end

  def media_item_params
    params.require(:blob).permit!
  end
end
