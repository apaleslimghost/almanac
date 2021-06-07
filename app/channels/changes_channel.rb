class ChangesChannel < ApplicationCable::Channel
  def subscribed
    campaign = Campaign.find_by_slug(params[:campaign])
    stream_for campaign
  end
end
