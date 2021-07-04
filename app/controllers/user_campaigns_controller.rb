class UserCampaignsController < ApplicationController
	before_action :set_campaign
	layout "header_and_content"

	def index; end

	def create
		raise HttpException::Forbidden unless @campaign.owner? current_user

		user = User.find_by_username! params[:user_campaign][:user][:username]
		user_campaign = UserCampaign.new(
			user: user,
			campaign: @campaign,
			access: params[:user_campaign][:access]
		)

		if user_campaign.save
			redirect_to campaign_user_campaigns_path(@campaign)
		else
			render :index
		end
	end

	def update
		user_campaign = UserCampaign.find(params[:id])

		raise HttpException::Forbidden unless user_campaign.user == current_user

		if user_campaign.update(user_campaign_params)
			redirect_to user_campaign.campaign
		else
			redirect_to user_campaign.campaign # TODO what
		end
	end

	def destroy
		user_campaign = UserCampaign.find(params[:id])
		can_delete = user_campaign.user == current_user or @campaign.owner? current_user

		raise HttpException::Forbidden unless can_delete

		user_campaign.destroy
		redirect_to current_user
	end

	def set_campaign
		@campaign = Campaign.find_by_slug!(params[:campaign_id])
		@image = @campaign.image
	end

	def user_campaign_params
		params.require(:user_campaign).permit(
			:accepted
		)
	end
end
