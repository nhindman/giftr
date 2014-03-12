class AddWebsiteColumnToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :website, :string
  end
end
