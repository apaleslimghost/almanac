import {withTracker} from 'meteor/react-meteor-data'
import React from 'react'
import _ from 'lodash'
import {compose} from 'recompact'
import {withCampaignSession} from '../data/campaign'

import {Cards} from '../../shared/collections'
import {Card} from '../../shared/methods'
import subscribe from '../utils/subscribe'
import {buildGraph, distances} from '../utils/graph'

import ShowCard, {EditCard} from '../document/card'
import {Card as CardPrimitive} from '../visual/primitives'
import {FlexGrid} from '../visual/grid'

const withCardListActions = withTracker(props => {
	const {campaignSession, campaignId} = props
	const selectedCard = campaignSession.get('selectedCard')
	// TODO: use withCard
	const cards = Cards.find({campaignId}).fetch()

	if (selectedCard) {
		const graph = buildGraph(cards)
		const d = distances(graph, selectedCard)

		cards.forEach(card => {
			card.sortedIndex = d[card._id]
		})
	}

	return {
		ready: subscribe('cards.all'),
		cards: _.orderBy(cards, ['sortedIndex', 'title']),
		addCard(card) {
			Card.create({...card, campaignId})
		}
	}
})

const connectCardList = compose(
	withCampaignSession,
	withCardListActions
)

const CardList = connectCardList(({cards, addCard}) => (
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
