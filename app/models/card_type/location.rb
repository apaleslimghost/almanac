class CardType::Location < ApplicationRecord
  include CardType::Concern

  has_many :children, class_name: 'CardType::Location', foreign_key: :parent_id
  belongs_to :parent, class_name: 'CardType::Location', optional: true

  def self.permitted_attributes
    %i[parent_id]
  end

  def self.description
    "A physical location in your world, from a continent down to a house"
  end
end
