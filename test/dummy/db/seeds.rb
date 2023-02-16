# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
#
# Delete all uploads
`rm -rf #{Rails.root}/public/uploads/*`

# Load files
Dir["#{Rails.root}/db/seeds/**/*.rb"].each { |file| load file }

# Disable mails in seeds
ActionMailer::Base.perform_deliveries = false

title("Users")
seed_users

title("Pages")
seed_pages

title("Polls")
seed_polls(10)

title("Settings")
seed_settings
