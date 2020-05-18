import { useSubscription, useCursor } from '../utils/hooks'
import { Cards } from '../../lib/collections'
import { useCampaignId } from './campaign'

export const useCardSearch = ({ search }) => {
	const campaignId = useCampaignId()
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
