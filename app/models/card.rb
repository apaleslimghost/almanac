class Card < ApplicationRecord
  actable
  has_unique_slug
  belongs_to :campaign
  has_one :image, as: :imageable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }

  def html_body
    CommonMarker.render_html(body).html_safe
  end
end
