import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';
import getCampaignSession from '../../shared/session';
import {withCampaign} from '../components/campaign';

import {Cards} from '../../shared/collections';
import subscribe from '../subscribe';
import idFirst from '../id-first';
import {buildGraph, distances} from '../graph';

import Card, {EditCard} from './card';
import {Grid, Card as CardPrimitive, List, Label, LabelBody} from './primitives';

const CardList = createContainer(() => ({
	addCard(card) {
		Cards.insert(card);
	}
}), ({cards, addCard}) => <Grid>
	{cards.map(card => <Card key={card._id} card={card} />)}

	<CardPrimitive>
		<EditCard card={{}} saveCard={addCard} />
	</CardPrimitive>
</Grid>);

const CardListContainer = withCampaign(createContainer(({campaignId}) => {
	const selectedCard = getCampaignSession(campaignId).get('selectedCard');
	let cards = Cards.find().fetch();

	if (selectedCard) {
		const graph = buildGraph(cards);
		const d = distances(graph, selectedCard);

		cards.forEach(card => (card.sortedIndex = d[card._id]));
	}

	return {
		ready: Meteor.subscribe('cards.all').ready(),
		cards: _.orderBy(cards, ['sortedIndex', 'title']),
	};
}, ({cards}) => <CardList cards={cards} />));

export default CardListContainer;
