class AddPollIdToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :poll_id, :integer
  end
end
