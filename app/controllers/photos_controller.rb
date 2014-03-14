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

def scrap
  scrape_this_page = params[:url]
  page = MetaInspector.new(scrape_this_page)
  scraped_images_array = page.images
  photo_array = []
  scraped_images_array.each do |photo|
    scraped_image = Photo.new(
      poll_id: params[:poll_id], 
      website: params[:website], 
      url: photo
      )
    scraped_image.save!
    photo_array.push(scraped_image)
  end
  # binding.pry
  render json: photo_array
end


end

