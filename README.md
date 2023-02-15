# Formstrap
An extensive Bootstrap form library to power your Ruby On Rails application.

## Installation
Add this line to your application's gemfile ```./Gemfile```
```bash
gem 'formstrap'
```

Do we import bootstrap somehow or is this an installation step (like in bootstrap_form?)

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
  <%= f.email :email %>
  <%= f.password :password %>
  <%= f.checkbox :remember_me %>
  <%= f.submit "Log In" %>
<% end %>
```

As you might have noticed, Formstrap uses different form helpers than Ruby on Rails. An overview is provided, alongside with the method one can use to access the Ruby on Rails helpers:

| Type              | Formstrap helpers | Ruby on Rails helpers      |
|-------------------|-------------------|----------------------------|
| Association       | association       | N/A                        |
| Checkbox          | checkbox          | checkbox_without_formstrap |
| Color             | color             | color_without_formstrap    |
| Date              | date              | date_without_formstrap     |
| Date range        | date_range        | N/A                        |
| Datetime          | datetime          | datetime_without_formstrap |
| Datetime range    | datetime_range    | N/A                        |
| Email             | email             | email_without_formstrap    |
| File              | file              | file_without_formstrap     |
| Flatpickr *       | flatpickr         | N/A                        |
| Flatpickr range * | flatpickr_range   | N/A                        |
| Hidden            | hidden            | hidden_without_formstrap   |
| Media             | media             | N/A                        |
| Number            | number            | number_without_formstrap   |
| Password          | password          | password_without_formstrap |
| RedactorX *       | redactorx         | N/A                        |
| Select            | select            | select_without_formstrap   |
| Switch            | switch            | N/A                        |
| Text              | text              | text_without_formstrap     |
| Textarea          | textarea          | textarea_without_formstrap |
| URL               | url               | url_without_formstrap      |
| WYSIWYG *         | wysiwyg           | N/A                        |

\* Formstrap provides the implementation of these 3rd party libraries, however it is up to the user to provide the correct assets


### Altering Formstrap helpers
Because Formstrap uses html and Ruby on Rails helpers behind the scenes to render its helpers, editing the Formstrap helpers is straightforward.

As Formstrap is an engine, its views are within the gem. In order to have a copy of the views inside your application, run: 
```bash
rails generate formstrap:views
```
This will create a map ```./views/formstrap```, in which all the views (and its helpers) are copied in and can thus be altered.

### Extending Formstrap helpers
Extending Formstrap helpers is straightforward.

Copy your custom Formstrap (e.g. map) helper into the map ```./views/formstrap```. Afterwards, this view is accessible by:

```erb
<%= formstrap_form_for(@user) do |f| %>
    <%= f.map :address %>
<% end %>
```

