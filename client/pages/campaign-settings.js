import React from 'react'
import { compose, withHandlers } from 'recompact'
import { withCampaignData } from '../data/campaign'
import CampaignSettings from '../document/campaign-settings'
import { Campaign } from '../../shared/methods'
import { go } from '../utils/router'
import { assertAmOwner } from '../data/owner'
import { Main } from '../visual/grid'

const withCampaignActions = withHandlers({
	onSubmit: ({ campaign }) => data => {
		Campaign.update(campaign, data)
		go(`/${campaign._id}`)
	}
})

const connectCampaignSettings = compose(
	withCampaignData,
	assertAmOwner('campaign'),
	withCampaignActions
)

const CampaignSettingsPage = connectCampaignSettings(CampaignSettings)

export default () => (
	<Main>
		<CampaignSettingsPage />
	</Main>
)
