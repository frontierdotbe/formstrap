# Formstrap Changelog

## 0.2
- BREAK: The partial `formstrap/blocks` was removed.
- BREAK: Add these initializers to project

config/initializers/extend_active_storage_attachment.rb
```ruby
Rails.configuration.to_prepare do
  ActiveStorage::Attachment.include Formstrap::Attachment
  
  # Feel free to extend ActiveStorage::Attachment with your own concerns
  # ActiveStorage::Attachment.include Admin::Attachment
end
```

config/initializers/extend_active_storage_blob.rb.rb
```ruby
Rails.configuration.to_prepare do
  ActiveStorage::Blob.include Formstrap::Blob
  
  # Feel free to extend ActiveStorage::Blob with your own concerns
  # ActiveStorage::Blob.include Admin::Blob
end
```
