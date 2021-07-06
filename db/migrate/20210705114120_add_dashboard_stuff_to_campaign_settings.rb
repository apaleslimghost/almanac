class AddDashboardStuffToCampaignSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_settings, :current_location_id, :integer
  end
end
