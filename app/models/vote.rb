class Vote < ActiveRecord::Base

  belongs_to :poll
  belongs_to :user
  belongs_to :item
  belongs_to :photo

  
end
