class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.only_visible(*methods)
    methods.each do |method|
      define_method(method) do
        super().filter { _1.visible?(Current.user) }
      end
    end
  end

  def self.if_visible(*methods)
    methods.each do |method|
      define_method(method) do
        card = super()

        if card && card.visible?(Current.user)
          card
        end
      end
    end
  end
end
