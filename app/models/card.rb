class Card < ApplicationRecord
  has_unique_slug
  belongs_to :campaign
end
