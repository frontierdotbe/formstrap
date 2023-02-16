def seed_pages
  Page.create!(
    slug: "home",
    handle: "home",
    title: "Home",
    blocks_attributes: [
      {
        name: "list",
        fields_hash: {
          list: [
            {
              url: "https://test.be",
              name: "Test 1"
            },
            {
              url: "https://test.be",
              name: "Test 2"
            }
          ]
        }
      }
    ]
  )
end
