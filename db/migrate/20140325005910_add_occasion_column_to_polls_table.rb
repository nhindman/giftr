class AddOccasionColumnToPollsTable < ActiveRecord::Migration
  def change
    add_column :polls, :occasion, :string
  end
end
