module CardType
   module Concern
      extend ActiveSupport::Concern

      included do
         puts self
         acts_as :card

         def self.model_name
            ActiveModel::Name.new(self, nil, self.name.demodulize)
         end
      end

      def to_param
         card.to_param
      end
   end
end
