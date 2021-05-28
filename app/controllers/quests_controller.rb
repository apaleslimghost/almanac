class QuestsController < ApplicationController
   before_action :set_campaign, only: %i[index new create show edit update destroy]

   def set_campaign
      @campaign = Campaign.find_by_slug(params[:campaign_id])
   end

   def new
      @card = Card.new
      @card.actable = CardType::Quest.new
   end
end
