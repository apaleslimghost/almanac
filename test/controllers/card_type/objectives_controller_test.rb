require "test_helper"

class CardType::ObjectivesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @card_type_objective = card_type_objectives(:one)
  end

  test "should get index" do
    get card_type_objectives_url
    assert_response :success
  end

  test "should get new" do
    get new_card_type_objective_url
    assert_response :success
  end

  test "should create card_type_objective" do
    assert_difference('CardType::Objective.count') do
      post card_type_objectives_url, params: { card_type_objective: { completed: @card_type_objective.completed, quest_id: @card_type_objective.quest_id } }
    end

    assert_redirected_to card_type_objective_url(CardType::Objective.last)
  end

  test "should show card_type_objective" do
    get card_type_objective_url(@card_type_objective)
    assert_response :success
  end

  test "should get edit" do
    get edit_card_type_objective_url(@card_type_objective)
    assert_response :success
  end

  test "should update card_type_objective" do
    patch card_type_objective_url(@card_type_objective), params: { card_type_objective: { completed: @card_type_objective.completed, quest_id: @card_type_objective.quest_id } }
    assert_redirected_to card_type_objective_url(@card_type_objective)
  end

  test "should destroy card_type_objective" do
    assert_difference('CardType::Objective.count', -1) do
      delete card_type_objective_url(@card_type_objective)
    end

    assert_redirected_to card_type_objectives_url
  end
end
