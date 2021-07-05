class CampaignSettings < ApplicationRecord
  belongs_to :campaign
  has_secure_token :invite_token
end
