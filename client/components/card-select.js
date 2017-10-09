import {Meteor} from 'meteor/meteor'
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';

import {Cards} from '../../shared/collections';
import {getSelectValue} from './form';

//TODO: typeahead?

const CardSelect = ({cardsById, onSelect}) =>
	_.size(cardsById)
		? <select
			onChange={ev => onSelect(cardsById[getSelectValue(ev.target)])}>
			<option disabled value="" />
			{_.map(cardsById, card =>
				<option key={card._id} value={card._id}>{card.title}</option>
			)}
		</select>
		: null;

const CardSelectContainer = createContainer({
	pure: false,
	getMeteorData: ({skip = []}) => ({
		ready: Meteor.subscribe('cards.all').ready(),
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}}).fetch(), '_id'),
	}),
}, CardSelect);

export default CardSelectContainer;
