class CardType::Quest < ApplicationRecord
  include CardType::Concern
  has_many :objectives, class_name: 'CardType::Objective'

   def self.permitted_attributes
      %i[completed]
   end
end
