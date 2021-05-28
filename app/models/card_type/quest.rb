class CardType::Quest < ApplicationRecord
   acts_as :card

   def self.permitted_attributes
      %i[completed]
   end
end
