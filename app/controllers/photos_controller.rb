class PhotosController < ApplicationController

def index
  @photos = Photo.where(poll_id: params[:poll_id])
    respond_to do |format|
      format.html
      format.json { render json: @photos}
  end
end

def new
  @photo = Photo.new
end

def create
  photo = Photo.new
  scrape_this = "http://"+params[:photo][:url]
  photo.poll_id = params[:photo][:poll_id]
  pages = MetaInspector.new(scrape_this)
  scraped_image = pages.images[4]
  photo.url = scraped_image
  # photo.scrapedimage = scraped_image
  photo.save!
  render json: photo
  # binding.pry
end


end

