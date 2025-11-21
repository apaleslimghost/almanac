class CardType::Controller < ApplicationController
   before_action :set_card, only: %i[show edit update destroy]
   before_action :set_campaign, only: %i[index new create show edit update destroy]
   before_action :append_view_paths

   layout "card"

   def show; end

   def set_card
      @card = Card.find_by_id!(params[:id]).specific
      @image = @card.image
      raise ActiveRecord::RecordNotFound unless @card.visible?(current_user)
   end

   def set_campaign
      @campaign = Campaign.find_by_slug!(params[:campaign_id])
      raise ActiveRecord::RecordNotFound unless @campaign.visible?(current_user)
   end

   def append_view_paths
      append_view_path "app/views/cards"
   end

   def card_type
      raise NotImplementedError
   end

   def self.controller_path
      super.gsub(/^card_type\//, '')
   end
end
