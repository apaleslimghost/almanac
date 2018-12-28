import React from 'react'
import _ from 'lodash'
import { compose } from 'recompact'
import { withCampaignSession } from '../data/campaign'
import withCards from '../data/card'

import ShowCard from '../document/card'
import { FlexGrid } from '../visual/grid'
import withLoading from '../control/loading'

const withAllCards = withCards('cards')

const connectCardList = compose(
	withCampaignSession,
	withAllCards,
	withLoading
)

const CardList = connectCardList(({ cards, addCard }) => (
	<FlexGrid>
		{cards.map(card => (
			<ShowCard key={card._id} card={card} />
		))}
	</FlexGrid>
))

export default CardList
