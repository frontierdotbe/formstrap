def seed_polls(count = 1)
  count.times do |index|
    Poll.create!(
      name: "Poll #{index + 1}",
      poll_type: Poll.poll_type.values.sample,
      questions_attributes: [
        {
          title: "Question 1",
          position: 1
        },
        {
          title: "Question 2",
          position: 2
        },
        {
          title: "Question 3",
          position: 3
        }
      ]
    )
  end
end
