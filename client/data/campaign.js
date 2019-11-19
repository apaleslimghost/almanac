import { createContext, useContext } from 'react'
import { useSubscription, useFindOne } from 'meteor/quarterto:hooks'
import { NotFound } from 'http-errors'
import getCampaignSession from '../../shared/session'
import { Campaigns } from '../../shared/collections'

export const useCampaignData = ({ campaignId, secret }) => {
	const campaignReady = useSubscription('campaigns.all')
	const joinReady = useSubscription('campaigns.join', { campaignId, secret })
	const ready = campaignReady && (!secret || joinReady)
	const campaign = useFindOne(Campaigns, campaignId, [ready])

	return { campaign, ready }
}

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
