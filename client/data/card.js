import { withTracker } from 'meteor/react-meteor-data'
import { useTracker } from 'meteor/quarterto:hooks'
import { Cards } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import { useCampaignId } from './campaign'

const find = (collection, query, single, options) =>
	single ? collection.findOne(query) : collection.find(query, options).fetch()

const withCards = (key, query = {}, { single = false, ...options } = {}) =>
	withTracker(({ campaignId, ...props }) => ({
		ready: subscribe('cards.all'),
		[key]: find(
			Cards,
			Object.assign(
				{ campaignId },
				typeof query === 'function' ? query(props) : query,
			),
			single,
			options,
		),
	}))

export const useCards = (query, { single = false, ...options } = {}) => {
	const campaignId = useCampaignId()
	return useTracker(() => ({
		ready: subscribe('cards.all'),
		cards: find(Cards, { campaignId, ...query }, single, options)
	}))
}

export const withCard = withCards('card', ({ cardId }) => ({ _id: cardId }), {
	single: true,
})

export default withCards
