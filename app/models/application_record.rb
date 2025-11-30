class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.only_visible(*methods)
    methods.each do |method|
      alias_method "_#{method}", method
      define_method(method) do
        super().select { _1.visible?(Current.user, Current.minimum_visibility) }
      end
    end
  end

  def self.if_visible(*methods)
    methods.each do |method|
      alias_method "_#{method}", method
      define_method(method) do
        thing = super()

        if thing && thing.visible?(Current.user, Current.minimum_visibility)
          thing
        end
      end
    end
  end

  def previous_change_summary
    previous_changes
      .except(:updated_at).keys
      .map { it.humanize(capitalize: false) }
      .to_sentence
  end
end
