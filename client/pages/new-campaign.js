import { withHandlers } from 'recompact'
import { navigate as go } from 'use-history'
import CampaignSettings from '../document/campaign-settings'
import { Campaign } from '../../shared/methods'

const withCampaignActions = withHandlers({
	onSubmit: () => async data => {
		data.member = []
		const { _id } = await Campaign.create(data)
		go(`/${_id}`)
	},
})

export default withCampaignActions(CampaignSettings)
