import { createContext, useContext } from 'react'
import { useTracker } from 'meteor/quarterto:hooks'
import { NotFound } from 'http-errors'
import getCampaignSession from '../../shared/session'
import { Campaigns } from '../../shared/collections'
import subscribe from '../utils/subscribe'

export const useCampaignData = ({ campaignId, secret }) =>
	useTracker(() => ({
		campaign: Campaigns.findOne(campaignId),
		ready:
			subscribe('campaigns.all') &&
			(!secret || subscribe(['campaigns.join', { campaignId, secret }])),
	}))

export const checkCampaignExists = ({ campaign, ready, campaignId }) => {
	if (campaignId && ready && !campaign) {
		throw new NotFound(`Campaign ${campaignId} not found`)
	}
}

export const CampaignContext = createContext({})
export const useCampaign = () => useContext(CampaignContext)
export const useCampaignId = () => useCampaign()._id
export const useCampaignSession = () => {
	const id = useCampaignId()
	return getCampaignSession(id)
}
