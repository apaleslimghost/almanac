class CardType::ObjectivesController < ApplicationController
  before_action :set_card_type_objective, only: [:show, :edit, :update, :destroy]

  # GET /card_type/objectives
  def index
    @card_type_objectives = CardType::Objective.all
  end

  # GET /card_type/objectives/1
  def show
  end

  # GET /card_type/objectives/new
  def new
    @card_type_objective = CardType::Objective.new
  end

  # GET /card_type/objectives/1/edit
  def edit
  end

  # POST /card_type/objectives
  def create
    @card_type_objective = CardType::Objective.new(card_type_objective_params)

    if @card_type_objective.save
      redirect_to @card_type_objective, notice: 'Objective was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /card_type/objectives/1
  def update
    if @card_type_objective.update(card_type_objective_params)
      redirect_to @card_type_objective, notice: 'Objective was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /card_type/objectives/1
  def destroy
    @card_type_objective.destroy
    redirect_to card_type_objectives_url, notice: 'Objective was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_card_type_objective
      @card_type_objective = CardType::Objective.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def card_type_objective_params
      params.require(:card_type_objective).permit(:completed, :quest_id)
    end
end
