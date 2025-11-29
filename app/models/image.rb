class Image < ApplicationRecord
  actable
  belongs_to :imageable, polymorphic: true
  accepts_nested_attributes_for :actable

  def build_actable(params)
    self.actable = actable_type.constantize.new(params)
  end

  def self.valid_params?(params)
    params.has_key? :actable_type and
      params.has_key? :actable_attributes and
      params[:actable_type].constantize.valid_params?(
        params[:actable_attributes]
      )
  end

  def actable_attributes=(attrs)
    if actable_type == 'UnsplashImage'
      self.actable = UnsplashImage.find_or_create_by(unsplash_id: attrs[:unsplash_id])
    else
      super
    end
  end
end
