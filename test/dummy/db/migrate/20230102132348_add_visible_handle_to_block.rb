class AddVisibleHandleToBlock < ActiveRecord::Migration[7.0]
  def change
    add_column :blocks, :visible, :boolean, default: true
    add_column :blocks, :handle, :string
  end
end
