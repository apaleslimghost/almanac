class Image < ApplicationRecord
  actable
  belongs_to :imageable, polymorphic: true
end
