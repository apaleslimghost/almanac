class Campaign < ApplicationRecord
  has_unique_slug subject: :name
  belongs_to :owner, class_name: :User
  has_many :cards
  has_one :image, as: :imageable
end
