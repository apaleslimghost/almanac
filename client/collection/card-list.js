import React from 'react'
import { compose } from 'recompact'

import { withCampaignSession } from '../data/campaign'
import ShowCard from '../document/card'
import withLoading from '../control/loading'
import { FlexGrid } from '../visual/grid'
import withCardSearch from '../data/card-search'

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
