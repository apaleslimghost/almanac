class CardType::Quest < ApplicationRecord
   acts_as :card
   has_unique_slug

   def self.model_name
    ActiveModel::Name.new(self, nil, 'Quest')
   end

   def self.permitted_attributes
      %i[completed]
   end
end
