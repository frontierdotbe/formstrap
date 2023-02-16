def seed_users
  user = User.create!(
    first_name: "Jef",
    last_name: "Vlamings",
    email: "jef@frontier.be",
    password: "temporary",
    encrypted_password: "$2a$12$1xLoBZyJdlTsEYKyhac9WeR8r0UUQ4OSATJukamXgBNoq7Avxj20.",
    avatar: seed_file("users/insiting.jpg"),
    confirmed_at: Time.now,
    role: "admin"
  )
  yield user if block_given?

  user = User.create!(
    first_name: "Gert-Jan",
    last_name: "Peeters",
    email: "gert-jan@frontier.be",
    password: "temporary",
    encrypted_password: "$2a$12$VqfRxCMeJOzOWlZR1zSXcelEJgvODVMMRZXoQJWywsEWu85QGvhqa",
    avatar: seed_file("users/insiting.jpg"),
    confirmed_at: Time.now,
    role: "admin"
  )
  yield user if block_given?
end
