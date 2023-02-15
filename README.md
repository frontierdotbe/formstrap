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

As you might have noticed, Formstrap uses different form helpers than Ruby on Rails. An overview is proved:

| Input    | Formstrap | Ruby on Rails  |
|----------|-----------|----------------|
| Text     | text      | text_field     |
| Email    | email     | email_field    |
| Password | password  | password_field |
| Phone    | phone     | phone_field    |
| Checkbox | checkbox  | check_box      |

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

