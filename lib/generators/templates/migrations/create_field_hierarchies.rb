class CreateFieldHierarchies < ActiveRecord::Migration[6.1]
  def change
    create_table :field_hierarchies, id: false do |t|
      t.integer :ancestor_id, null: false
      t.integer :descendant_id, null: false
      t.integer :generations, null: false
    end

    add_index :field_hierarchies, [:ancestor_id, :descendant_id, :generations],
      unique: true,
      name: "field_anc_desc_idx"

    add_index :field_hierarchies, [:descendant_id],
      name: "field_desc_idx"
  end
end
