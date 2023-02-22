class AddParentToPages < ActiveRecord::Migration[7.0]
  def change
    add_reference :pages, :parent, index: true
  end
end
