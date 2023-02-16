Rails.configuration.to_prepare do
  ActiveStorage::Attachment.include Headmin::Attachment
end
