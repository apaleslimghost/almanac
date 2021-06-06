class Card < ApplicationRecord
  actable
  has_unique_slug
  belongs_to :campaign
  belongs_to :owner, class_name: 'User'
  has_one :image, as: :imageable
  has_many :card_links
  has_many(
    :related,
    through: :card_links,
    class_name: 'Card',
    source: :to
  )
  accepts_nested_attributes_for :actable
  accepts_nested_attributes_for :image, reject_if: proc { |attributes| !Image.valid_params? attributes }

  default_scope { includes :owner }

  enum visible: %i[only_me me_and_gm campaign public], _prefix: true
  enum editable: %i[only_me me_and_gm campaign], _prefix: true

  validate :visibility_greater_than_editablility

  only_visible :related, :card_links

  def visibility_greater_than_editablility
    unless Card.visibles[visible] >= Card.editables[editable]
      errors.add(:visible, "A card must be visible to the users that can edit it")
    end
  end

  def has_access?(attr, user)
    case attr
    when "only_me"
      user == owner
    when "me_and_gm"
      campaign.owner?(user) || user == owner
    when "campaign"
      campaign.users.where(user: user).exists?
    when "public"
      campaign.settings.public
    else
      false
    end
  end

  def editable?(user)
    has_access?(editable, user)
  end

  def visible?(user)
    has_access?(visible, user)
  end

  def owner?(user)
    user == owner
  end

  def build_actable(params)
    self.actable = actable_type.constantize.new(params)
  end

  def html_body
    CommonMarker.render_html(body).html_safe
  end

  def self.types
    CardType.constants
      .map { ('CardType::' + _1.to_s).constantize }
      .select { _1 < ApplicationRecord }
  end

  def icon
    specific.icon
  end
end
