class Link < ApplicationRecord
  belongs_to :from
  belongs_to :to

  def link_type=(new_type)
    return unless Link.types.include? new_type

    Link.types.each do |type|
      self[type] = type == new_type ? 1 : 0
    end
  end

  def link_type
    Link.types.find do |type|
      self[type] == 1
    end
  end

  def self.types
    _dag_options.types.keys
  end
end
