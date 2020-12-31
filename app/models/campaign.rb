class Campaign < ApplicationRecord
  has_unique_slug subject: :name
  belongs_to :owner, class_name: :User
end
