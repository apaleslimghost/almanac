import {withHandlers} from 'recompact'

export default withHandlers({
	onIncrement: ({
		campaignSession,
		CampaignDate,
		period,
		multiplier = 1
	}) => () => {
		campaignSession.set(
			'date',
			new CampaignDate(campaignSession.get('date') || 0).add({
				[period]: multiplier
			}).timestamp
		)
	}
})
