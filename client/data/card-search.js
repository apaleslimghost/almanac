import { useSubscription, useCursor } from 'meteor/quarterto:hooks'
import { Cards } from '../../shared/collections'

export const useCardSearch = ({ search, campaignId }) => {
	const ready = useSubscription('cards.all', search)
	const cards = useCursor(
		Cards.find(
			{ campaignId },
			search
				? {
						sort: [['score', 'desc']],
				  }
				: {
						sort: [['title', 'asc']],
				  },
		),
		[ready, search, campaignId],
	)

	return { ready, cards }
}
