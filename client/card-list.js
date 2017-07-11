import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {buildGraph, distances} from '../src/graph';
import {Cards, Types} from '../src/collections';

import Card, {EditCard} from './card';
import {Grid, Card as CardPrimitive} from './primitives';

const CardList = ({cards, saveCard, deleteCard}) =>
	<Grid>
		{cards.map((card, i) =>
			<Card
				key={card._id}
				card={card}
				saveCard={saveCard}
				deleteCard={deleteCard}
				large={i === 0}
			/>
		)}

		<CardPrimitive>
			<EditCard card={{}} saveCard={saveCard} />
		</CardPrimitive>
	</Grid>;

const CardListContainer = createContainer(() => {
	const selectedCard = Session.get('selectedCard');
	const cards = Cards.find({}).fetch();

	if (selectedCard) {
		const types = Types.find({}).fetch();
		const typesById = _.keyBy(types, '_id');
		const cardsById = _.keyBy(cards, '_id');

		const graph = buildGraph(cards);
		const d = distances(graph, selectedCard);

		const relatedByRelatee = _.groupBy(_.get(cardsById, [selectedCard, 'related'], []), 'card');

		cards.forEach(card => {
			card.distance = d[card._id];
			card.relatedTypes = _.map(relatedByRelatee[card._id], ({type}) => typesById[type]);
		});
	}

	return {
		cards: _.orderBy(cards, ['distance', 'title']),

		saveCard(card) {
			if (card._id) {
				Cards.update(card._id, card);
			} else {
				Cards.insert(card);
			}
		},

		deleteCard(card) {
			Cards.remove(card._id);

			const relatedCards = Cards.find({related: card._id}).fetch();
			relatedCards.forEach(related => {
				Cards.update(related._id, {
					$pull: {related: card._id},
				});
			});
		},
	};
}, CardList);

export default CardListContainer;
