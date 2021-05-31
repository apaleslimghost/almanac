class Campaign < ApplicationRecord
  has_unique_slug subject: :name
  has_many :user_campaigns
  has_many :users, through: :user_campaigns
  has_many :cards
  has_one :image, as: :imageable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }

  has_many :quests, source_type: 'CardType::Quest', through: :cards, source: :actable
  has_many :locations, source_type: 'CardType::Location', through: :cards, source: :actable
  has_many :objectives, source_type: 'CardType::Objective', through: :cards, source: :actable
end
