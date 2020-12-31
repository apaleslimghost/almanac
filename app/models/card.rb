class Card < ApplicationRecord
  actable
  has_unique_slug
  belongs_to :campaign

  def html_body
    CommonMarker.render_html(body).html_safe
  end
end
