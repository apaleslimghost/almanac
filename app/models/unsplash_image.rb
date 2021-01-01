class UnsplashImage < ApplicationRecord
  acts_as :image
  belongs_to :imageable, polymorphic: true

  before_save do
    self.data ||= Unsplash::Photo.find(unsplash_id)
  end
end
