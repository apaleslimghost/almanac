class UnsplashImagesController < ApplicationController
   def search
      @parent_form = params[:parent_form]
      @field_name = params[:field_name]
      @q = params[:q]
      @results = UnsplashImage.search(params[:q])
   end
end
