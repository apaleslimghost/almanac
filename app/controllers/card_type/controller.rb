class CardType::Controller < ApplicationController
   before_action :set_card, only: %i[show edit update destroy]
   before_action :set_campaign, only: %i[index new create show edit update destroy]
   before_action :append_view_paths

   layout "card"

   def new
      @card = card_type.new
      @card.card = Card.new
      @card.campaign = @campaign
      render 'edit'
   end

   def show; end
   def edit; end

   def set_card
      @card = Card.find_by_slug(params[:id]).specific
      @image = @card.image
   end

   def set_campaign
      # TODO check access to campaign
      @campaign = Campaign.find_by_slug(params[:campaign_id])
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
