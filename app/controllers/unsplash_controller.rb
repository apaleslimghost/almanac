class UnsplashController < ApplicationController
   def search
      render json: UnsplashImage.search(params[:q])
   end
end
