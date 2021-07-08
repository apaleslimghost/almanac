class CampaignSettings < ApplicationRecord
  belongs_to :campaign
  has_secure_token :invite_token
  belongs_to :current_location, class_name: 'CardType::Location', optional: true

  after_save :broadcast

  def broadcast
    DashboardChannel.broadcast_to(self, {
      campaign: campaign.slug,
      location: current_location.slug
    })
  end
end
