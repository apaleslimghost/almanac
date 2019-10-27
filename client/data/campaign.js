import { createContext, useContext } from 'react'
import { useTracker } from 'meteor/quarterto:hooks'
import { NotFound } from 'http-errors'
import getCampaignSession from '../../shared/session'
import { Campaigns } from '../../shared/collections'
import subscribe from '../utils/subscribe'

export const useCampaignData = ({ campaignId, secret }) =>
	useTracker(() => ({
		ready:
			subscribe('campaigns.all') &&
			(!secret || subscribe(['campaigns.join', { campaignId, secret }])),
		campaign: Campaigns.findOne(campaignId),
	}))

export const checkCampaignExists = ({ campaign, ready, campaignId }) => {
	if (campaignId && ready && !campaign) {
		throw new NotFound(`Campaign ${campaignId} not found`)
	}
}

export const CampaignContext = createContext({ _id: null })
export const useCampaign = () => useContext(CampaignContext)
export const useCampaignId = () => useCampaign()._id
export const useCampaignSession = () => {
	const id = useCampaignId()
	return getCampaignSession(id)
}
