class UserCampaign < ApplicationRecord
  belongs_to :user
  belongs_to :campaign
  enum access: %i[owner member]
end
