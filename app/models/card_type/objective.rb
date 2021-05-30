class CardType::Objective < ApplicationRecord
  include CardType::Concern
  belongs_to :quest, class_name: 'CardType::Quest'

  def self.permitted_attributes
    %i[completed quest_id]
  end

  def self.description
    "A single part of a quest"
  end
end
