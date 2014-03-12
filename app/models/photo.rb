class Photo < ActiveRecord::Base

  belongs_to :poll
  has_many :votes

  # mount_uploader :url, UrlUploader
  
end
