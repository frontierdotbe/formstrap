# Headmin Changelog

## 0.6
- FEATURE: Blocks can now be configured to have custom anchor names and have its visibility toggled
- BREAK: Add this migration to current projects that make use of blocks
```ruby
class AddVisibleHandleToBlock < ActiveRecord::Migration[7.0]
  def change
    add_column :blocks, :visible, :boolean, default: true
    add_column :blocks, :handle, :string
  end
end
```

## 0.5
- FEATURE: Filters now have support for operators and conditionals 
- BREAK: `headmin/filters` now return a form object that is required for each individual form
- DEPRECATED: `Headmin::Searchable` is replaced with `Headmin::Filterable`. 
  - A `filter(params, types)` method is available and accepts an optional types argument.
  - The `search()` method is now deprecated and no longer required

## 0.4.2
- FEATURE: New field type "files" to allow simple gallery creation
- FIX: Fields hash with duplicate keys no longer mix up
- BREAK: Image field is now deprecated. Use the file field instead
- BREAK: Field uses "has_many_attached :files" instead of "has_one_attache :file" now. Rename "file" to "files" in `active_storage_attachments`
- BREAK: You need to set a File object in the fields_hash, instead of creating an intermediate Blob instance

## 0.4
- FEATURE: Introduction of a `ViewModel` class to clean up the component views. This allows for a cleaner abstraction and better testing.
- FEATURE: New `wysiwyg` component which currently defaults to Redactor X. Redactor X will be swapped with a free open source version in the 1.0 release.
- FEATURE: `headmin/forms/redactorx` now accepts `hybrid: true` to hide the controls
- FEATURE: `headmin/forms/wysiwyg` accepts a `toolbar: false` to thide the top toolbar
- FEATURE: Validation highlighting has been added to all form fields
- FEATURE: Autocomplete suggestions added to `headmin/forms/text`, `headmin/forms/url`, `headmin/forms/email` and `headmin/forms/search`
- FIX: Readonly inputs didn't show the default greyed out background color
- FIX: Top corners of repeaters were square
- FIX: Square corners on group fields are now round
- BREAK: Passing the names of the blocks in `headmin/forms/blocks` is now required. The `allow` parameter is deprecated in favor of `names`.
- BREAK: `headmin/card` has been removed
- BREAK: `headmin/forms/actions` and all of its child components have been removed
- BREAK: `$font-weight-medium` has been removed from headmin overrides variables. We don't want to introduce new variable names that look like they are part of Bootstrap.
- BREAK: `headmin/forms/date_range` has a different way of setting attribute specific values. We now have a `:start` and `:end` attribute that accept all possible input options for their respective inputs. Both have a required `:attribute` parameter now.
- BREAK: filter concern (controllers) has been renamed to filterable
```erb
# Old
<%= render 'headmin/forms/date_range', form: form, start_attribute: :start_date, end_attribute: :end_date %>

# New
<%= render 'headmin/forms/date_range', form: form, start: {attribute: :start_date}, end: {attribute: :end_date} %>
```

## 0.3

- Support for import maps added
- Headmin is now works with Rails 7
- All JS is moved to Stimulus controllers thus deprecating the need for a custom initialization process
- Makeover of `headmin/forms/file`
    - added attribute `dropzone` to enable drag&drop
    - added attribute `preview` to enable previews
- Image previews for `headmin/forms/image` are not enabled by default anymore. To enable you can add `preview: true`. To
  render previews for attachments add them as nested_attributes to your model

```rb
has_one_attached :image
accepts_nested_attributes_for :image_attachment
```

- **BREAK**: CKEditor has been removed in favor of RedactorX.  
  Download a purchased copy of RedactorX and add it to your `<head>` like this:

```html

<head>
    <script src="<%= asset_path('redactorx') %>" type="module"></script>
</head>
```

## 0.2.8

- ...
