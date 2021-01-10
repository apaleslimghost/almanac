class LinksController < ApplicationController
  def create
    @link = Link.new(link_params)
    @link.from = Card.find_by_slug(params[:card_id])

    @link.save
    redirect_to [@link.from.campaign, @link.from]
  end

  def destroy; end

  private

  def link_params
    params.require(:link).permit(:to_id, :link)
  end
end
