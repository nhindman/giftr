class ChangeFbIdToBigInt < ActiveRecord::Migration
  def change
    change_column :polls, :recipient_fb_id, :bigint
  end
end
