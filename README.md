# Formstrap

Formstrap enhances the default Rails form helpers with Bootstrap-friendly markup and extended functionality. 
Simply replace your existing ```form_with``` calls with ```formstrap_form_with```, and your forms will automatically be styled according to Bootstrap (5.3.x) conventions.

In addition to clean and responsive markup, Formstrap offers a set of extended form helpers out of the box:

- A WYSIWYG editor for rich text fields
- A date range picker
- A media picker for selecting Active Storage assets
- ...and more

## Installation

Add Formstrap to your Rails application
```bash
bundle add 'formstrap'
```

And copy the default configuration with:
```bash
rails generate formstrap:install
```

We're a big believer of "BYOD" Bring Your Own Dependencies.  
You need to have Bootstrap (5.3.x) already installed in your application.

Formstrap provides support for Redactor (Paid), TomSelect and Flatpickr.
If you wish to make use of these dependencies you need to provide them yourself.

## Usage

### Getting started

Use the Formstrap helpers ```formstrap_form_for``` or ```formstrap_form_with``` instead of the Ruby on Rails helpers
```form_for``` or ```form_with```.

An example:

```erb
<%= formstrap_form_for(@user) do |f| %>
  <%= f.email :email, required: true %>
  <%= f.password :password, required: true %>
  <%= f.checkbox :remember_me, required: true %>
  <%= f.submit "Log In" %>
<% end %>
```

To fallback to the default form helpers add ```formstrap: false```:

```erb
<%= formstrap_for_for(@user) do |f| %>
  <%= f.text :name, formstrap: false %>
  <%= f.text_field :name %>
<% end %>
```

An overview of all the Formstrap / Ruby on Rails form helpers:

| Type              | Formstrap helpers | Ruby on Rails helpers                       |
|-------------------|-------------------|---------------------------------------------|
| Association       | association       | N/A                                         |
| Checkbox          | checkbox          | checkbox formstrap: false or check_box      |
| Color             | color             | color formstrap: false or color_field       |
| Date              | date              | date formstrap: false or date_field         |
| Date range        | date_range        | N/A                                         |
| Datetime          | datetime          | datetime formstrap: false or datetime_field |
| Datetime range    | datetime_range    | N/A                                         |
| Email             | email             | email formstrap: false or email_field       |
| File              | file              | file formstrap: false or file_field         |
| Flatpickr *       | flatpickr         | N/A                                         |
| Flatpickr range * | flatpickr_range   | N/A                                         |
| Hidden            | hidden            | hidden formstrap: false or hidden_field     |
| Media             | media             | N/A                                         |
| Number            | number            | number formstrap: false or number_field     |
| Password          | password          | password formstrap: false or password_field |
| Redactor  *       | redactor          | N/A                                         |
| Search            | search            | N/A                                         |
| Select            | select            | select formstrap: false                     |
| Switch            | switch            | N/A                                         |
| Text              | text              | text formstrap: false or text_field         |
| Textarea          | textarea          | textarea formstrap: false or text_area      |
| URL               | url               | url formstrap: false or url_field           |
| WYSIWYG *         | wysiwyg           | N/A                                         |
| Repeater          | repeater_for      | Adds advanced features to fields_for        |

Formstrap provides more helpers than what is standard in Ruby on Rails, e.g. ```Media```, ```Date range```, ```Redactor```.

#### Media
A visual media picker that allows you to select ActiveStorage blobs to be attached to the current record.
Works with ```has_many_attached``` and ```has_one_attached```

```erb
<%= formstrap_form_with do |form| %>
  <%= form.media :image %>
  <%= form.media :files %>
<% end %>
```

![Screenshot 2025-05-01 at 10 06 37](https://github.com/user-attachments/assets/458a8264-2e21-46f9-9eae-d21ab3f37e27)

#### Date range
The default date range picker adds 2 date pickers. There's also "Flatpickr range" for a combined input which depends on Flatpickr

```erb
<%= formstrap_form_with do |form| %>
  <%= form.date_range start: {attribute: :start_date}, end: {attribute: :end_date} %>
<% end %>
```

![Screenshot 2025-05-01 at 10 16 32](https://github.com/user-attachments/assets/b516523f-fbc4-4fb8-a97a-047f706cb410)

#### WYSIWYG
This form helper depends on Redactor (paid).

```erb
<%= formstrap_form_with do |form| %>
  <%= form.wysiwyg :text %>
<% end %>
```

![Screenshot 2025-05-01 at 10 21 52](https://github.com/user-attachments/assets/04a5d62b-8c04-4251-b7b6-c16dc1aeb3aa)

#### Repeater
This form helper allows you to manage nested attributes in a visually appealing way. (replacement for cocoon)
It adds buttons to: add and delete rows. A drag-&-drop interface allows you to reorder rows.
To persist the order of rows a `position` attribute should be available on the associated model.

```erb
<%= formstrap_form_with do |form| %>
  <% form.repeater_for :questions do |question| %>
    <% render "admin/questions/fields, form: :question" %>
  <% end %>
<% end %>
```

![Screenshot 2025-05-01 at 10 25 21](https://github.com/user-attachments/assets/f3594bab-d376-4c07-9234-7d350c3350a1)


### Overriding Formstrap helpers

Because Formstrap uses html and Ruby on Rails helpers behind the scenes to render its helpers, editing the Formstrap
helpers is straightforward.

As Formstrap is an engine, its views are within the gem. In order to have a copy of the views inside your application,
run:

```bash
rails generate formstrap:views
```

This will create a directory ```./views/formstrap```, in which all the views (and its helpers) are copied in and can thus be
inspected / altered. Because Formstrap is an engine, the application's local files take precedence over the engine's files.

Running the command again will override the files already present in your application.

### Build your own Formstrap helpers

Extending Formstrap helpers is straightforward.
Add your custom Formstrap (e.g. map) helper into the map ```./views/formstrap```. Formstrap makes it possible to access this helper is by its filename.


```erb
<%# custom Formstrap helper file: ./views/formstrap/_map.html.erb %>

<%= formstrap_form_for(@user) do |f| %>
    <%= f.map :address %>
<% end %>
```

## Development

For development purposes it's helpful to have both the test project and Formstrap located in the same directory.

In Gemfile

```ruby
gem "formstrap", path: "../formstrap"
```

In package.json

```json
{
  "dependencies": {
    "formstrap": "link:../formstrap"
  }
}
```

To see frontend changes update live in development run
```shell
# Watches changes and builds them on-the-fly
yarn dev
```

### Javascript

When adding new dependencies, make sure you add them to the `package.json` file as well as the `importmap.rb` file.

## Testing

Run tests with

```shell
rake test
```

Or to run a single file
```shell
rake test TEST=path/to/test/file.rb
```

If you want to test a specific feature in a staging environment without releasing the gem, you can refer to the remote
repo in your Gemfile and package.json.

In Gemfile

```ruby
gem 'formstrap', git: 'git@github.com:frontierdotbe/formstrap.git', branch: 'feature/test'
```

In package.json

```json
{
  "dependencies": {
    "formstrap": "ssh://git@github.com:frontierdotbe/formstrap.git#feature/test"
  }
}

```

## Releasing

After integration a new feature of fixing a bug, first commit and push your changes.

Update the gem

```shell
# First bundle if new runtime dependencies were added
$ bundle

# Update the version number, push commits and tag the release
$ gem bump -v {patch,minor,major,...} --push --tag

# Release to Rubygems and create a Github release tag
$ gem release
```

Update the node package

```shell
# Manually update the version number in package.json
$ yarn build 
$ npm publish --access public
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/frontierdotbe/formstrap. This project is intended
to be a safe, welcoming space for collaboration, and contributors are expected to adhere to
the [code of conduct](https://github.com/frontierdotbe/formstrap/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Formstrap project's codebases, issue trackers, chat rooms and mailing lists is expected to
follow the [code of conduct](https://github.com/frontierdotbe/formstrap/blob/master/CODE_OF_CONDUCT.md).
