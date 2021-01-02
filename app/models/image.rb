class Image < ApplicationRecord
  actable
  belongs_to :imageable, polymorphic: true
  accepts_nested_attributes_for :actable

  def self.build(params)
    Image.new(
      actable: params[:actable_type].constantize.new(params[:actable_attributes])
    )
  end
end
