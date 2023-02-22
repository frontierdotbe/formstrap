class ExtendUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :type, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :role, :string, default: nil
    add_column :users, :blocked, :boolean
  end
end
