import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import { NotFound } from 'http-errors'
import { compose, withProps, withContext, getContext } from 'recompact'
import getCampaignSession from '../../shared/session'
import { Campaigns } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import withLoading from '../control/loading'

export const getCampaign = withTracker(({ campaignId, secret }) => ({
	ready:
		subscribe('campaigns.all') &&
		(!secret ||
			Meteor.subscribe('campaigns.join', { campaignId, secret }).ready()),
	campaign: Campaigns.findOne(campaignId)
}))

const checkCampaignExists = withProps(({ campaign, ready, campaignId }) => {
	if (campaignId && ready && !campaign) {
		throw new NotFound(`Campaign ${campaignId} not found`)
	}
})

export const campaignExists = compose(
	getCampaign,
	checkCampaignExists
)

export const campaignContext = {
	campaignId: PropTypes.string
}

export const withCampaign = getContext(campaignContext)
export const withCampaignId = withCampaign

export const withCampaignData = compose(
	withCampaignId,
	getCampaign,
	withLoading
)

export const setsCampaignContext = withContext(campaignContext, props => ({
	campaignId: props.campaignId
}))

export const setsCampaign = compose(
	campaignExists,
	withLoading,
	setsCampaignContext
)

const setCampaignSession = withTracker(({ campaignId }) => ({
	ready: subscribe('session.all'),
	campaignSession: getCampaignSession(campaignId)
}))

export const withCampaignSession = compose(
	withCampaign,
	setCampaignSession
)
