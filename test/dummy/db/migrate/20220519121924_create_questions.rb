class CreateQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :questions do |t|
      t.belongs_to :poll
      t.string :title
      t.integer :points, default: 0
      t.integer :position
      t.timestamps
    end
  end
end
