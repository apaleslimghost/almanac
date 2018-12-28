import React from 'react'
import _ from 'lodash'
import { compose, withHandlers } from 'recompact'
import { withCampaignSession } from '../data/campaign'
import withCards from '../data/card'
import { Card } from '../../shared/methods'

import ShowCard, { EditCard } from '../document/card'
import { Card as CardPrimitive } from '../visual/primitives'
import { FlexGrid } from '../visual/grid'
import withLoading from '../control/loading'

const withAllCards = withCards('cards')

const withCardListActions = withHandlers({
	addCard: ({ campaignId }) => card => {
		Card.create({ ...card, campaignId })
	}
})

const connectCardList = compose(
	withCampaignSession,
	withCardListActions,
	withAllCards,
	withLoading
)

const CardList = connectCardList(({ cards, addCard }) => (
	<FlexGrid>
		{cards.map(card => (
			<ShowCard key={card._id} card={card} />
		))}

		<CardPrimitive>
			<EditCard isOwner card={{}} saveCard={addCard} />
		</CardPrimitive>
	</FlexGrid>
))

export default CardList
