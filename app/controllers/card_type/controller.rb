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

   def edit
      render status: :forbidden unless @card.editable?(current_user)
   end

   def set_card
      @card = Card.find_by_slug(params[:id]).specific
      @image = @card.image
      raise ActionController::RoutingError.new('Not Found') unless @card.visible?(current_user)
   end

   def set_campaign
      @campaign = Campaign.find_by_slug(params[:campaign_id])
      raise ActionController::RoutingError.new('Not Found') unless @campaign.visible?(current_user)
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
