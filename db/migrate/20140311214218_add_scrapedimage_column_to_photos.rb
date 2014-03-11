class AddScrapedimageColumnToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :scrapedimage, :string
  end
end
