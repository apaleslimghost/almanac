import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {buildGraph, distances} from '../src/graph';
import {Cards, Types, CardLinks} from '../src/collections';

import Card, {EditCard} from './card';
import {Grid, Card as CardPrimitive, List, Label} from './primitives';

import findJoined from '../src/find-joined';

const CardList = ({cards}) =>
	<Grid>
		{cards.map(card =>
			<Card
				key={card._id}
				card={card}
			/>
		)}
	</Grid>;

const CardColumnContainer = createContainer(({type}) => {
	const cards$ = Meteor.subscribe('cards.all');
	const links$ = Meteor.subscribe('cards.links');

	const selectedCard = Session.get('selectedCard');

	const links = findJoined(CardLinks, {
		type: type._id,
	});

	const graph = buildGraph(links);
	const d = distances(graph, selectedCard);

	const cards = links.map(link => link.cards[1]);

	cards.forEach(card => {
		card.distance = d[card._id];
	});

	return {
		cards: _.orderBy(_.reject(cards, ['distance', undefined]), ['distance', 'title']),

		addCard(card) {
			Cards.insert(card, (err, added) => {
				if(err) return;

				CardLinks.insert({
					cards: [selectedCard, added],
					type: type._id,
				});
			});
		}
	};
}, ({cards, addCard}) => <List vertical>
	{cards.map(card => <Card key={card._id} card={card} />)}

	<CardPrimitive>
		<EditCard card={{}} saveCard={addCard} />
	</CardPrimitive>
</List>);

const CardColumns = ({types, selectedCard}) => <Grid>
	{selectedCard && <Card large card={selectedCard} />}

	{types.map(type => <List key={type._id}>
		<Label large {...type.colour}>{type.name}</Label>
		<CardColumnContainer type={type} />
	</List>)}
</Grid>;

const CardColumnsContainer = createContainer(() => ({
	ready: Meteor.subscribe('links.types').ready() && Meteor.subscribe('cards.all').ready(),
	types: Types.find().fetch(),
	selectedCard: Cards.findOne(Session.get('selectedCard')),
}), CardColumns);

//TODO: card columns by link type, sort by distance within column

const CardListContainer = createContainer(() => ({
	selectedCard: Session.get('selectedCard'),
	ready: Meteor.subscribe('cards.all').ready(),
	cards: Cards.find().fetch(),
}), ({selectedCard, cards}) => selectedCard
	? <CardColumnsContainer />
	: <CardList cards={cards} />);

export default CardListContainer;
