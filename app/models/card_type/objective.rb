class CardType::Objective < ApplicationRecord
  include CardType::Concern
  belongs_to :quest, class_name: 'CardType::Quest'
end
