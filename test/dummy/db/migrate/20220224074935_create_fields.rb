class CreateFields < ActiveRecord::Migration[6.1]
  def change
    create_table :fields do |t|
      t.references :fieldable, polymorphic: true
      t.string :name
      t.string :field_type
      t.integer :parent_id
      t.integer :position
      t.text :value
      t.timestamps
    end
  end
end
