class CardType::Quest < ApplicationRecord
  include CardType

   def self.permitted_attributes
      %i[completed]
   end
end
