class CampaignsController < ApplicationController
  before_action :set_campaign, only: %i[show edit update destroy]
  before_action :check_access, only: %i[new create show edit update destroy]

  # GET /campaigns
  def index
    @campaigns = Campaign.all
  end

  # GET /campaigns/1
  def show; end

  # GET /campaigns/new
  def new
    @campaign = Campaign.new
  end

  # GET /campaigns/1/edit
  def edit; end

  # POST /campaigns
  def create
    @campaign = Campaign.new(campaign_params)
    @campaign.owner = current_user

    if @campaign.save
      redirect_to @campaign, notice: 'Campaign was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /campaigns/1
  def update
    # TODO: updating associated image
    if @campaign.update(campaign_params)
      redirect_to @campaign, notice: 'Campaign was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /campaigns/1
  def destroy
    @campaign.destroy
    redirect_to campaigns_url, notice: 'Campaign was successfully destroyed.'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_campaign
    @campaign = Campaign.find_by_slug(params[:id])
  end

  def check_access
    unless current_user && (!@campaign || @campaign.owner == current_user)
      raise ActionController::RoutingError, 'Not Found'
    end
  end

  # Only allow a list of trusted parameters through.
  def campaign_params
    params.require(:campaign).permit(
      :name,
      :tagline,
      image_attributes: [
        :id,
        :actable_type,
        { actable_attributes: %i[id unsplash_id] }
      ]
    )
  end
end
