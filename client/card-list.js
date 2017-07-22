import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';

import {buildGraph, distances} from '../src/graph';
import {Cards, Types, CardLinks} from '../src/collections';

import Card, {EditCard} from './card';
import {Grid, Card as CardPrimitive} from './primitives';

import findJoined from '../src/find-joined';

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
	const cards$ = Meteor.subscribe('cards.all');
	const links$ = Meteor.subscribe('cards.links');


	const selectedCard = Session.get('selectedCard');
	const links = CardLinks.find().fetch();
	const cards = Cards.find({}).fetch();

	if (selectedCard) {
		const linkedToSelected = _.groupBy(findJoined(CardLinks, {
			'cards.0': selectedCard
		}), 'cards.1._id');

		const graph = buildGraph(links);
		const d = distances(graph, selectedCard);

		cards.forEach(card => {
			card.distance = d[card._id];
			card.relatedTypes = (linkedToSelected[card._id] || []).map(({type}) => type);
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
