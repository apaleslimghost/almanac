class CardType::Quest < ApplicationRecord
  include CardType::Concern
  has_many :objectives, class_name: 'CardType::Objective'

   def self.permitted_attributes
      %i[completed]
   end

   def self.description
    "An overall goal the players are working towards, grouping several objectives together"
   end
end
