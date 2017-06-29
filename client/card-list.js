import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {buildGraph, distances} from '../src/graph';
import {Cards} from '../src/collections';

import Card, {EditCard} from './card';
import {List, Card as CardPrimitive} from './primitives';

const CardList = ({cards, saveCard, deleteCard}) =>
	<List>
		{cards.map(card =>
			<Card
				key={card._id}
				card={card}
				saveCard={saveCard}
				deleteCard={deleteCard}
			/>
		)}

		<CardPrimitive>
			<EditCard card={{}} saveCard={saveCard} />
		</CardPrimitive>
	</List>;

const CardListContainer = createContainer(() => {
	const selectedCard = Session.get('selectedCard');
	let cards = Cards.find({}).fetch();

	if (selectedCard) {
		const graph = buildGraph(cards);
		const d = distances(graph, selectedCard);

		cards.forEach(card => (card.sortedIndex = d[card._id]));
	}

	return {
		cards: _.orderBy(cards, ['sortedIndex', 'title']),

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
