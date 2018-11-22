import {withHandlers} from 'recompact'
import CampaignSettings from '../document/campaign-settings'
import {Campaign} from '../../shared/methods'
import {go} from '../utils/router'

const withCampaignActions = withHandlers({
	onSubmit: ({campaign}) => async data => {
		data.member = []
		const {_id} = await Campaign.create(data)
		go(`/${_id}`)
	}
})

export default withCampaignActions(CampaignSettings)
