class Campaign < ApplicationRecord
  has_unique_slug subject: :name
  has_many :user_campaigns
  has_many :users, through: :user_campaigns
  has_many :cards
  has_one :image, as: :imageable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }
end
