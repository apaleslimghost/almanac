import React, { useState } from 'react'
import { useCampaignSession } from '../../data/campaign'
import useInterval from 'use-interval'
import { useCampaignDate } from '../../data/calendar'

const AdvanceTime = () => {
	const [enabled, setEnabled] = useState(false)
	const campaignSession = useCampaignSession()
	const CampaignDate = useCampaignDate()

	useInterval(() => {
		if (enabled) {
			campaignSession.set(
				'date',
				new CampaignDate(campaignSession.get('date') || 0).add({
					minute: 1,
				}).timestamp,
			)
		}
	}, 30000)

	return (
		<label>
			<input
				type='checkbox'
				checked={enabled}
				onChange={ev => setEnabled(ev.target.checked)}
			/>
			Advance time
		</label>
	)
}

export default AdvanceTime
