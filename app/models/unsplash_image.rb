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
end
