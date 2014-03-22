class PhotosController < ApplicationController

def index
  @photos = Photo.where(poll_id: params[:poll_id])
    respond_to do |format|
      format.html
      format.json { render json: @photos}
      # binding.pry
  end
end

def new
  @photo = Photo.new
end

def update
  @photo = Photo.find(params[:id])
  @photo.update_attributes!(selected: params[:selected], poll_id: params[:poll_id])
  render json: @photo
end

def scrap
  scrape_this_page = params[:url]
  page = MetaInspector.new(scrape_this_page)
  scraped_images_array = page.images
  photo_array = []
  scraped_images_array.each do |photo|
    # puts "################ #{photo}"
    existing_photo = Photo.where(:url => photo).first
    # If photo does not already exist in db, create new
    if existing_photo.nil? || existing_photo.url != photo
      scraped_image = Photo.new(
        poll_id: params[:poll_id], 
        website: params[:website], 
        url: photo
        )
      scraped_image.save!
    end
  end
  # binding.pry
  photo_array = Photo.where(:url => scraped_images_array) 
  render json: photo_array
end


end

