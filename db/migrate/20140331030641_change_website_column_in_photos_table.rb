class ChangeWebsiteColumnInPhotosTable < ActiveRecord::Migration
  def change
    change_column :photos, :website, :text
  end
end