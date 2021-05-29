class CardType::QuestsController < ApplicationController
   before_action :set_quest, only: %i[show edit update destroy]
   before_action :set_campaign, only: %i[index new create show edit update destroy]

   def new
      @card = Card.new
      @card.actable = CardType::Quest.new
   end

   def show
   end

   def set_quest
      @quest = Card.find_by_slug(params[:id]).specific
   end

   def set_campaign
      @campaign = Campaign.find_by_slug(params[:campaign_id])
   end
end
