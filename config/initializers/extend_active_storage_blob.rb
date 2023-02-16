Rails.configuration.to_prepare do
  ActiveStorage::Blob.include Headmin::Blob
end
