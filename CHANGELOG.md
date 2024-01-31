# Formstap Changelog

## 0.2
- BREAK: Add these initializers to project

config/initializers/extend_active_storage_attachment.rb
```ruby
Rails.configuration.to_prepare do
  ActiveStorage::Attachment.include Formstrap::Attachment
  ActiveStorage::Attachment.include Admin::Attachment
end
```

config/initializers/extend_active_storage_blob.rb.rb
```ruby
Rails.configuration.to_prepare do
  ActiveStorage::Blob.include Formstrap::Blob
  ActiveStorage::Blob.include Admin::Blob
end
```
