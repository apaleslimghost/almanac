import { useTracker } from 'meteor/quarterto:hooks'
import subscribe from '../utils/subscribe'
import { Cards } from '../../shared/collections'

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
