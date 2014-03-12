class AddPhotoIdToVotesTable < ActiveRecord::Migration
  def change
    add_column :votes, :photo_id, :integer
  end
end
