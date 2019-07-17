import { createContext, useContext } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { useTracker } from 'meteor/quarterto:hooks'
import PropTypes from 'prop-types'
import { NotFound } from 'http-errors'
import { compose, withProps, withContext, getContext } from 'recompact'
import getCampaignSession from '../../shared/session'
import { Campaigns } from '../../shared/collections'
import subscribe from '../utils/subscribe'

export const getCampaign = withTracker(({ campaignId, secret }) => ({
	ready:
		subscribe('campaigns.all') &&
		(!secret || subscribe(['campaigns.join', { campaignId, secret }])),
	campaign: Campaigns.findOne(campaignId),
}))

export const useCampaignData = ({ campaignId, secret }) =>
	useTracker(() => ({
		ready:
			subscribe('campaigns.all') &&
			(!secret || subscribe(['campaigns.join', { campaignId, secret }])),
		campaign: Campaigns.findOne(campaignId),
	}))

const checkCampaignExists = withProps(({ campaign, ready, campaignId }) => {
	if (campaignId && ready && !campaign) {
		throw new NotFound(`Campaign ${campaignId} not found`)
	}
})

export const campaignContext = {
	campaign: PropTypes.object,
}

export const withCampaignData = getContext(campaignContext)

export const withCampaign = compose(
	withCampaignData,
	withProps(({ campaign }) => ({ campaignId: campaign && campaign._id })),
)

export const withCampaignId = withCampaign

export const setsCampaignContext = withContext(
	campaignContext,
	({ campaign }) => ({ campaign }),
)

export const setsCampaign = compose(
	getCampaign,
	checkCampaignExists,
	setsCampaignContext,
)

const setCampaignSession = withTracker(({ campaignId }) => ({
	ready: subscribe('session.all'),
	campaignSession: getCampaignSession(campaignId),
}))

export const withCampaignSession = compose(
	withCampaign,
	setCampaignSession,
)

export const CampaignContext = createContext({ _id: null })
export const useCampaign = () => useContext(CampaignContext)
export const useCampaignId = () => useCampaign()._id
export const useCampaignSession = () => {
	const id = useCampaignId()
	return getCampaignSession(id)
}
