class AddUnsplashImageIndex < ActiveRecord::Migration[8.1]
  def change
    add_index :unsplash_images, :unsplash_id, unique: true
  end
end
