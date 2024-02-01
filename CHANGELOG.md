# Formstrap Changelog

## 0.2
- FEATURE: Search added to media modal
- FEATURE: Thumbnail supports SVG previews now
- FIX: You can upload new media and select it right away
- FIX: Flickering heights of thumbnails in media modal is fixed
- BREAK: All partials in `formstrap/fields/` are removed.
 
Copy the partials from `formstrap/fields/` to your project and customize them.

- BREAK: The partial `formstrap/blocks` is removed.
 
Copy `formstrap/blocks.html.erb` to your project and customize it.
 
- BREAK: Default filtering logic for ActiveStorage models is included in Formstrap.

To remove redundant code in your project, you can add these initializers.

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
