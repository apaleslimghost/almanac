class ApplicationController < ActionController::Base
  helper_method :current_user
  before_action :store_user

  def store_user
    Current.user = current_user
  end

  def current_user
    User.find(session[:user_id]) if session[:user_id]
  end
end
