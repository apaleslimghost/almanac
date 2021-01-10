class Link < ApplicationRecord
  belongs_to :from
  belongs_to :to
end
