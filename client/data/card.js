import { withTracker } from 'meteor/react-meteor-data'
import { Cards } from '../../shared/collections'
import subscribe from '../utils/subscribe'

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

export const withCard = withCards('card', ({ cardId }) => ({ _id: cardId }), {
	single: true,
})

export default withCards
