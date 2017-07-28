import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {buildGraph, distances} from '../src/graph';
import {Cards, Types, CardLinks} from '../src/collections';
import subscribe from '../src/subscribe';

import Card, {EditCard} from './card';
import {Grid, Card as CardPrimitive, List, Label} from './primitives';

import findJoined from '../src/find-joined';

const CardList = ({cards}) => <Grid>
	{cards.map(card => <Card key={card._id} card={card} />)}
</Grid>;

const CardColumnContainer = createContainer(({type, cards}) => {
	const selectedCard = Session.get('selectedCard');

	return {
		cards: _.orderBy(cards, ['distance', 'title']),

		addCard(card) {
			Cards.insert(card, (err, added) => {
				if(!err && type) {
					CardLinks.insert({
						cards: [selectedCard, added],
						type: type._id,
					});
				}
			});
		}
	};
}, ({cards, addCard}) => <List vertical spaced>
	{cards.map(card => <Card key={card._id} card={card} />)}

	<CardPrimitive>
		<EditCard card={{}} saveCard={addCard} />
	</CardPrimitive>
</List>);

const CardColumns = ({types, selectedCard, linkedCardsByType, unlinkedCards}) => <Grid>
	{selectedCard && <Card large card={selectedCard} />}

	{types.map(type => <div key={type._id}>
		<Label large {...type.colour}>{type.name}</Label>
		<CardColumnContainer type={type} cards={linkedCardsByType[type._id]} />
	</div>)}

	{unlinkedCards.map(card => <Card key={card._id} card={card} />)}
</Grid>;

const CardColumnsContainer = createContainer(() => {
	const ready = subscribe('links.types', 'cards.all', 'cards.links');

	const types = Types.find().fetch();

	const allCards = Cards.find().fetch();
	const unlinkedCards = _.keyBy(allCards, '_id');

	const selectedCard = Session.get('selectedCard');

	const allLinks = findJoined(CardLinks, {});
	const linksByType = _.groupBy(allLinks, 'type._id');

	_.unset(unlinkedCards, selectedCard);

	const linkedCardsByType = _.fromPairs(types.map(type => {
		const links = linksByType[type._id];
		let cards = [];

		if(links) {
			const graph = buildGraph(links);
			const d = distances(graph, selectedCard);

			cards = links.reduce((cards, {cards: [, card]}) => {
				card.distance = d[card._id];

				if(card.distance) {
					_.unset(unlinkedCards, card._id);
					return cards.concat(card);
				}

				return cards;
			}, []);
		}

		return [type._id, cards];
	}));

	return {
		ready,
		types,
		linkedCardsByType,
		unlinkedCards: _.values(unlinkedCards),
		selectedCard: Cards.findOne(Session.get('selectedCard')),
	};
}, CardColumns);

//TODO: card columns by link type, sort by distance within column

const CardListContainer = createContainer(() => ({
	selectedCard: Session.get('selectedCard'),
	ready: Meteor.subscribe('cards.all').ready(),
	cards: Cards.find().fetch(),
}), ({selectedCard, cards}) => selectedCard
	? <CardColumnsContainer />
	: <CardList cards={cards} />);

export default CardListContainer;
