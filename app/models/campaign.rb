class Campaign < ApplicationRecord
  has_unique_slug subject: :name
  has_many :user_campaigns
  has_many :users, through: :user_campaigns
  has_many :cards
  has_one :settings, class_name: :CampaignSettings, required: true
  has_one :image, as: :imageable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }
  accepts_nested_attributes_for :settings

  has_many :quests, source_type: 'CardType::Quest', through: :cards, source: :actable
  has_many :locations, source_type: 'CardType::Location', through: :cards, source: :actable
  has_many :objectives, source_type: 'CardType::Objective', through: :cards, source: :actable

  alias_method :campaign_users, :user_campaigns

  def visible?(user)
    settings.public || (user && users.include?(user))
  end

  def owner?(user)
    campaign_users.where(user: user, access: :owner).exists?
  end
end
