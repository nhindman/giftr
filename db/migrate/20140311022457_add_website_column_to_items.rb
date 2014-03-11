class AddWebsiteColumnToItems < ActiveRecord::Migration
  def change
    add_column :items, :website, :string
  end
end
