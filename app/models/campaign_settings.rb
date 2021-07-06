class CampaignSettings < ApplicationRecord
  belongs_to :campaign
  has_secure_token :invite_token
  has_one :current_location, class_name: 'CardType::Location', optional: true

  after_save :broadcast

  def broadcast
    DashboardChannel.broadcast_to self, current_location
  end
end
