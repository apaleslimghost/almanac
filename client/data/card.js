import { useTracker } from 'meteor/quarterto:hooks'
import { Cards } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import { useCampaignId } from './campaign'

const find = (collection, query, single, options) =>
	single ? collection.findOne(query) : collection.find(query, options).fetch()

export const useCards = (
	query,
	{ single = false, deps = [], ...options } = {},
) => {
	const campaignId = useCampaignId()
	return useTracker(
		() => ({
			ready: subscribe('cards.all'),
			cards: find(Cards, { campaignId, ...query }, single, options),
		}),
		deps,
	)
}

export const useCard = (_id, deps = []) => {
	const { ready, cards } = useCards({ _id }, { single: true, deps })
	return { ready, card: cards }
}
