class CreateBlocks < ActiveRecord::Migration[6.1]
  def change
    create_table :blocks do |t|
      t.references :blockable, polymorphic: true
      t.string :name
      t.integer :position
      t.timestamps
    end
  end
end
