class CardType::Quest
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :completed, :boolean
end
