class UnsplashImage < ApplicationRecord
  acts_as :image

  before_save do
    self.data ||= Unsplash::Photo.find(unsplash_id)
  end
end
