import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';

import {Cards} from '../../shared/collections';
import subscribe from '../subscribe';
import idFirst from '../id-first';

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

const CardListContainer = createContainer(() => ({
	ready: Meteor.subscribe('cards.all').ready(),
	cards: Cards.find().fetch(),
}), ({cards}) => <CardList cards={cards} />);

export default CardListContainer;
