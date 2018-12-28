import {withTracker} from 'meteor/react-meteor-data'
import {compose} from 'recompact'
import {withCampaignSession} from '../../../data/campaign'
import {withCampaignDate} from '../../../data/calendar'

const withTime = withTracker(({campaignSession, CampaignDate}) => ({
	date: new CampaignDate(campaignSession.get('date') || 0)
}))

export default compose(
	withCampaignSession,
	withCampaignDate,
	withTime
)
