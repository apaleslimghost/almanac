class SessionsController < ApplicationController
  layout 'header_and_content'

  def new
    @image = UnsplashImage.brand_image
  end

  def create
    user = User.find_by_username(params[:username])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      if params[:redirect_back]
        redirect_back notice: 'Logged in!', fallback_location: root_url
      else
        redirect_to root_url, notice: 'Logged in!'
      end
    else
      flash.now[:alert] = 'Username or password is invalid'
      render 'new'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Logged out!'
  end
end
