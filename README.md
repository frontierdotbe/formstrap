# Formstrap

An extensive Bootstrap form library to power your Ruby On Rails application.

## Installation

Add this line to your application's gemfile ```./Gemfile```

```bash
gem 'formstrap'
```

Afterwards, run:

```bash
bundle
```

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

As you might have noticed, Formstrap uses different named form helpers than Ruby on Rails.

If the original Rails helper needs to be accessed, it can be accessed by:

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
| RedactorX *       | redactorx         | N/A                                         |
| Search            | search            | N/A                                         |
| Select            | select            | select formstrap: false                     |
| Switch            | switch            | N/A                                         |
| Text              | text              | text formstrap: false or text_field         |
| Textarea          | textarea          | textarea formstrap: false or text_area      |
| URL               | url               | url formstrap: false or url_field           |
| WYSIWYG *         | wysiwyg           | N/A                                         |

\* Formstrap provides the implementation of these 3rd party libraries, however it is up to the user to provide the
correct assets.

As you might have noticed, Formstrap provides more helpers than what is standard in Ruby on Rails, e.g. ```Media```, ```Date range```, ```RedactorX``` ...

### Altering Formstrap helpers

Because Formstrap uses html and Ruby on Rails helpers behind the scenes to render its helpers, editing the Formstrap
helpers is straightforward.

As Formstrap is an engine, its views are within the gem. In order to have a copy of the views inside your application,
run:

```bash
rails generate formstrap:views
```

This will create a directory ```./views/formstrap```, in which all the views (and its helpers) are copied in and can thus be
inspected / altered. Because Formstrap is an engine, the application's local files take precedence over the engine's files.

Note that on new releases, one can once more run:

```bash
rails generate formstrap:views
```

To get new or updated versions of the helpers. **This will override the files that are already present (and which might contain your personal adjustments)**.

### Extending Formstrap helpers

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
