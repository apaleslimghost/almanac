class Card < ApplicationRecord
  has_unique_slug
  belongs_to :campaign

  before_save do
    self[:data] = data.attributes
  end

  def html_body
    CommonMarker.render_html(body).html_safe
  end

  def data
    card_type.new(self[:data])
  end

  def card_type
    ('CardType::' + self[:card_type].camelize(:upper)).constantize if self[:card_type]
  end

  def self.valid_types
    CardType.constants.map(&:to_s).map(&:underscore)
  end
end
