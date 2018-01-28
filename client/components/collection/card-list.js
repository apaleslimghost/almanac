import {Meteor} from 'meteor/meteor';
import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import _ from 'lodash';
import {withCampaignSession} from '../../components/collection/campaign';
import {compose, withHandlers} from 'recompose';
import {render} from 'react-dom';

import {Cards} from '../../../shared/collections';
import subscribe from '../../subscribe';
import idFirst from '../../id-first';
import {buildGraph, distances} from '../../graph';

import Card, {EditCard} from '../card';
import {Grid, Card as CardPrimitive, List, Label, LabelBody} from '../visual/primitives';

const withCardListActions = withTracker(props => {
	const {campaignSession, campaignId} = props;
	const selectedCard = campaignSession.get('selectedCard');
	let cards = Cards.find({campaignId}).fetch();

	if (selectedCard) {
		const graph = buildGraph(cards);
		const d = distances(graph, selectedCard);

		cards.forEach(card => (card.sortedIndex = d[card._id]));
	}

	return {
		ready: Meteor.subscribe('cards.all').ready(),
		cards: _.orderBy(cards, ['sortedIndex', 'title']),
		addCard(card) {
			Cards.insert({...card, campaignId});
		}
	};
});

const connectCardList = compose(
	withCampaignSession,
	withCardListActions
);

const CardList = connectCardList(({cards, addCard}) => <Grid>
	{cards.map(card => <Card key={card._id} card={card} />)}

	<CardPrimitive>
		<EditCard card={{}} saveCard={addCard} />
	</CardPrimitive>
</Grid>);

export default CardList;
