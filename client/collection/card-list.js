import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose } from 'recompact'
import { withCampaignSession } from '../data/campaign'

import ShowCard from '../document/card'
import withLoading from '../control/loading'
import subscribe from '../utils/subscribe'
import { Cards } from '../../shared/collections'
import { FlexGrid } from '../visual/grid'

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

const connectCardList = compose(
	withCampaignSession,
	withCardSearch,
	withLoading,
)

const CardList = connectCardList(({ cards }) => (
	<FlexGrid>
		{cards.map(card => (
			<ShowCard key={card._id} card={card} />
		))}
	</FlexGrid>
))

export default CardList
