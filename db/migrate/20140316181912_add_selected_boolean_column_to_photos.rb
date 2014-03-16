class AddSelectedBooleanColumnToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :selected, :boolean, :default => false
  end
end
