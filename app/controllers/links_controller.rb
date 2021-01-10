class LinksController < ApplicationController
  def create
    @link = Link.find_or_initialize_by(link_params)
    @link.save
    redirect_to [@link.from.campaign, @link.from]
  end

  def destroy
    @link = Link.find(params[:id])
    @link.destroy
    redirect_to [@link.from.campaign, @link.from]
  end

  private

  def link_params
    params.require(:link).permit(:from_id, :to_id, :link_type)
  end
end
