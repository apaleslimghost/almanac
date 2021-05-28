class Card < ApplicationRecord
  actable
  has_unique_slug
  belongs_to :campaign
  has_one :image, as: :imageable
  accepts_nested_attributes_for :actable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }

  def build_actable(params)
    self.actable = actable_type.constantize.new(params)
  end

  def html_body
    CommonMarker.render_html(body).html_safe
  end

  def self.valid_types
    CardType.constants.map(&:to_s).map(&:underscore)
  end
end
