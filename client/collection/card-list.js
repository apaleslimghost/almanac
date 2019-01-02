import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose } from 'recompact'
import { withCampaignSession } from '../data/campaign'

import ShowCard from '../document/card'
import { MainGrid } from '../visual/grid'
import withLoading from '../control/loading'
import subscribe from '../utils/subscribe'
import { Cards } from '../../shared/collections'

const withCardSearch = withTracker(({ search }) => ({
	ready: subscribe(['cards.all', search]),
	cards: Cards.find(
		{},
		search
			? {
					sort: [['score', 'desc']]
			  }
			: {
					sort: [['title', 'asc']]
			  }
	).fetch()
}))

const connectCardList = compose(
	withCampaignSession,
	withCardSearch,
	withLoading
)

const CardList = connectCardList(({ cards }) => (
	<MainGrid>
		{cards.map(card => (
			<ShowCard key={card._id} card={card} />
		))}
	</MainGrid>
))

export default CardList
