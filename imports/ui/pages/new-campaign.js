import React from 'react'
import { navigate as go } from 'use-history'
import CampaignSettings from '../document/campaign-settings'
import { Campaign } from '../../lib/methods'

export default props => (
	<CampaignSettings
		onSubmit={async data => {
			data.member = []
			const { _id } = await Campaign.create(data)
			go(`/${_id}`)
		}}
		{...props}
	/>
)
