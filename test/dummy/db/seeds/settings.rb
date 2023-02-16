def seed_settings
  Setting.create!(
    name: "Company info",
    handle: "company",
    fields_hash: {
      name: "Insiting BV",
      image: File.open("db/seeds/files/users/insiting.jpg"),
      addresses: [
        {
          street: "Moerstraat",
          street_number: "66d",
          postal_code: "2320",
          city: "Hoogstraten"
        },
        {
          street: "Moerstraat",
          street_number: "30",
          postal_code: "2320",
          city: "Hoogstraten"
        }
      ]
    }
  )
  Setting.create!(
    name: "Site settings",
    handle: "website",
    fields_hash: {
      banner_text: "This is the text for the banner",
      primary_color: "red"
    }
  )
end
