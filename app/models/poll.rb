class Poll < ActiveRecord::Base

  has_many :items
  has_many :photos
  has_many :voters, through: :votes, source: :user
  has_many :votes
  belongs_to :creator, :class_name => 'User'

end
