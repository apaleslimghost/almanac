import React from 'react'
import { navigate as go } from 'use-history'
import { useCampaign } from '../data/campaign'
import CampaignSettings from '../document/campaign-settings'
import { Campaign } from '../../lib/methods'
import { useAssertAmOwner } from '../data/owner'
import { Main } from '../visual/grid'

export default () => {
	const campaign = useCampaign()
	useAssertAmOwner(campaign)

	function onSubmit(data) {
		Campaign.update(campaign, data)
		go(`/${campaign._id}`)
	}

	return (
		<Main>
			<CampaignSettings campaign={campaign} onSubmit={onSubmit} />
		</Main>
	)
}
