import { useCursor, useFindOne, useSubscription } from 'meteor/quarterto:hooks'
import { Cards } from '../../shared/collections'
import { useCampaignId } from './campaign'

export const useCards = (query, { deps = [], ...options } = {}) => {
	const campaignId = useCampaignId()
	const ready = useSubscription('cards.all')
	const cards = useCursor(Cards.find({ campaignId, ...query }, options), [
		ready,
		...deps,
	])
	return { ready, cards }
}

export const useCard = (_id, deps = []) => {
	const campaignId = useCampaignId()
	const ready = useSubscription('cards.all')
	const card = useFindOne(Cards, { campaignId, _id }, [ready, ...deps])
	return { ready, card }
}
