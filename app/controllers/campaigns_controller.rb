class CampaignsController < ApplicationController
  before_action :set_campaign, only: %i[show edit update destroy dashboard]
  before_action :check_access, only: %i[new create show edit update destroy]

  layout "header_and_content"

  # GET /campaigns
  def index
    @campaigns = current_user.campaigns
  end

  # GET /campaigns/1
  def show; end

  def dashboard
    @current_location = @campaign.dashboard.current_location
    @presenting = !@campaign.owner?(current_user) || params[:present]

    if @current_location && (!params[:location_id] || params[:location_id] != @current_location.to_param)
      redirect_to campaign_dashboard_path(@campaign, @current_location, {present: params[:present]})
    end

    if @presenting
      Current.minimum_visibility = "campaign"
    end

    @image = @current_location&.image || @campaign.image
  end

  # POST /campaigns
  def create
    @campaign = Campaign.new(campaign_params)

    @campaign.create_blank_slug!

    @campaign.dashboard = Dashboard.new
    @campaign.user_campaigns.new(
      user: current_user,
      campaign: @campaign, # TODO why is this necessary
      access: :owner,
      accepted: true
    )

    if @campaign.save
      redirect_to @campaign, notice: 'Campaign was successfully created.'
    else
      flash.now[:error] = "Problem creating campaign: #{@campaign.errors.full_messages.to_sentence}"
      render :edit
    end
  end

  # PATCH/PUT /campaigns/1
  def update
    if @campaign.update(campaign_params)
      flash.now[:success] = "Campaign #{@campaign.previous_change_summary} updated."

      respond_to do |f|
        f.turbo_stream {
          render turbo_stream: [
            turbo_stream.replace(:flash, partial: 'application/flash_messages'),
            if @campaign.previous_changes.key?(:slug)
              turbo_stream.action(:redirect, campaign_path(@campaign), method: 'replace')
            end,
          ].compact
        }
        f.html {
          redirect_to @campaign, notice: 'Campaign was successfully updated.', status: 303
        }
      end
    else
      flash.now[:error] = "Problem update campaign: #{@campaign.errors.full_messages.to_sentence}"
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
    @campaign = Campaign.find_by_slug!(params[:id] || params[:campaign_id])
    @image = @campaign.image
  end

  def check_access
    unless !@campaign || @campaign.visible?(current_user)
      raise ActiveRecord::RecordNotFound
    end
  end

  # Only allow a list of trusted parameters through.
  def campaign_params
    params[:campaign]&.permit([
      :name,
      :tagline,
      :public,
      image_attributes: [
        :id,
        :actable_type,
        { actable_attributes: %i[id unsplash_id] }
      ]
    ]) || {}
  end
end
