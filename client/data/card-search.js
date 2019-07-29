import { withTracker } from 'meteor/react-meteor-data'
import { useTracker } from 'meteor/quarterto:hooks'
import subscribe from '../utils/subscribe'
import { Cards } from '../../shared/collections'

const withCardSearch = withTracker(({ search, campaignId }) => ({
	ready: subscribe(['cards.all', search]),
	cards: Cards.find(
		{ campaignId },
		search
			? {
					sort: [['score', 'desc']],
			  }
			: {
					sort: [['title', 'asc']],
			  },
	).fetch(),
}))

export default withCardSearch

export const useCardSearch = ({ search, campaignId }) =>
	useTracker(
		() => ({
			ready: subscribe(['cards.all', search]),
			cards: Cards.find(
				{ campaignId },
				search
					? {
							sort: [['score', 'desc']],
					  }
					: {
							sort: [['title', 'asc']],
					  },
			).fetch(),
		}),
		[search, campaignId],
	)
