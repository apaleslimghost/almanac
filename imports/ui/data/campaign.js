import { createContext, useContext } from 'react'
import { useSubscription, useFindOne } from '../utils/hooks'
import getCampaignSession from '../../lib/session'
import { Campaigns } from '../../lib/collections'

export const useCampaignData = ({ campaignId, secret }) => {
	const campaignReady = useSubscription('campaigns.all')
	const joinReady = useSubscription('campaigns.join', { campaignId, secret })
	const ready = campaignReady && (!secret || joinReady)
	const campaign = useFindOne(Campaigns, campaignId, [campaignId, ready])

	return { campaign, ready }
}

export const checkCampaignExists = ({ campaign, ready, campaignId }) => {
	if (campaignId && ready && !campaign) {
		throw new Error(`Campaign ${campaignId} not found`)
	}
}

export const CampaignContext = createContext(null)
export const useCampaign = () => useContext(CampaignContext)
export const useCampaignId = () => useCampaign()._id
export const useCampaignSession = () => {
	const id = useCampaignId()
	return getCampaignSession(id)
}
