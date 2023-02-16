class Formstrap::MediaController < FormstrapController
  include Formstrap::Pagination
  layout false

  def index
    @blobs =
      ActiveStorage::Blob
        .not_attached_to_variant
        .by_mimetypes_string(media_params[:mimetype])
        .order(created_at: :desc)
        .group(:id)
        .all
    @blobs = paginate(@blobs)
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

  def media_params
    params.permit(
      :min,
      :max,
      :name,
      :mimetype,
      ids: [],
      files: []
    )
  end

  def media_item_params
    params.require(:blob).permit!
  end
end
