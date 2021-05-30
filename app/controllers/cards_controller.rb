class CardsController < ApplicationController
  before_action :set_campaign
  before_action :set_card, only: %i[update destroy]

  layout "header_and_content"

  # GET /cards/new
  def new
    @types = Card.types
  end

  # POST /cards
  def create
    @card = Card.new(card_params)
    @card.campaign = @campaign

    if @card.save!
      redirect_to [@campaign, @card.specific], notice: 'Card was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /cards/1
  def update
    if @card.update(card_params)
      redirect_to [@campaign, @card.specific], notice: 'Card was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /cards/1
  def destroy
    @card.destroy
    redirect_to campaign_cards_url(@campaign), notice: 'Card was successfully destroyed.'
  end

  private

  def set_campaign
    @campaign = Campaign.find_by_slug(params[:campaign_id])
  end

  def set_card
    @card = Card.find_by_slug(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def card_params
    unless params[:card][:actable_type].start_with?('CardType::')
      raise ActionController::BadRequest
    end

    actable_attributes = params[:card][:actable_type].constantize.permitted_attributes

    params.require(:card).permit(
      :title, :slug, :body, :campaign_id, :actable_type,
      actable_attributes: %i[id] + actable_attributes,
      image_attributes: [
        :id,
        :actable_type,
        { actable_attributes: %i[id unsplash_id] }
      ]
    )
  end
end
