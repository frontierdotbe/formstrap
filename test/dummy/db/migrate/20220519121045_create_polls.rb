class CreatePolls < ActiveRecord::Migration[7.0]
  def change
    create_table :polls do |t|
      t.boolean :digital
      t.date :end_date
      t.string :name
      t.string :poll_type, default: :general
      t.integer :position
      t.date :start_date
      t.integer :question_count
      t.timestamps
    end
  end
end
