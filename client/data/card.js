import { withTracker } from 'meteor/react-meteor-data'
import { Cards } from '../../shared/collections'
import subscribe from '../utils/subscribe'

const find = (collection, query, single) =>
	single ? collection.findOne(query) : collection.find(query).fetch()

export default (key, query = {}, { single = false } = {}) =>
	withTracker(({ campaignId, ...props }) => ({
		ready: subscribe('cards.all'),
		[key]: find(
			Cards,
			Object.assign(
				{ campaignId },
				typeof query === 'function' ? query(props) : query
			),
			single
		)
	}))
