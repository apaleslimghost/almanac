class UnsplashImage < ApplicationRecord
  acts_as :image

  before_save :load_photo

  def load_photo
    return unless !data || (data['id'] != unsplash_id)

    photo = Unsplash::Photo.find(unsplash_id)
    photo.track_download
    self.data = photo.to_h
  end

  def photo
    load_photo
    Unsplash::Photo.new data
  end

  def self.valid_params?(params)
    params.has_key? :unsplash_id and !params[:unsplash_id].empty?
  end
end
