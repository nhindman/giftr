class PollsController < ApplicationController

  def index
  @polls = Poll.where(id: params[:id])
  @render = false
    if session[:token]
      @render = true
    end
    respond_to do |format|
      format.html
      format.json { render json: @polls}
    end
  end

  def new
    @poll = Poll.new
  end

  def update
  @poll = Poll.find(params[:id])
  # binding.pry
  @poll.update_attributes!(occasion: params[:occasion])
  render json: @poll
  end

  def create
    @poll = Poll.create(poll_params)
    @poll.creator_id = current_user.id
    @poll.save
    render json: @poll
  end

  def show
    # login_callback_url = 
    # session['login_callback_url']
    # if session[:token]
    #   @render = true
    # else
    #   redirect_to '/users/auth/facebook'
    # end
    @user = current_user
    @poll = Poll.find(params["id"])
    session['login_callback_url'] = "/polls/#{@poll.id}"
    # binding.pry
    @items = Item.where(poll_id: @poll.id)
    @photos = Photo.where(poll_id: @poll.id)
    @voters = @poll.voters
  end

  private

  def poll_params
    params.require(:poll).permit(:creator_id, :recipient_name, :recipient_photo, :recipient_fb_id, :description, :end_date, :created_at, :updated_at, :occasion)
  end

end