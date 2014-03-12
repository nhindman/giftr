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
  photo.poll_id = params[:photo][:poll_id]
  photo.save!
  scrape_this_page = params[:photo][:url]
  page = MetaInspector.new(scrape_this_page)
  scraped_image = page.images[0]
  photo.update_attributes(url: scraped_image)
  render json: photo
end


end

