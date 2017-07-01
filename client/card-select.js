import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';

import {Cards} from '../src/collections';
import {getSelectValue} from './form';

const CardSelect = ({cardsById, onSelect}) =>
	_.size(cardsById) ? <select
		value=""
		onChange={ev => onSelect(cardsById[getSelectValue(ev.target)])}
	>
		<option disabled value="" />
		{_.map(cardsById, card =>
			<option key={card._id} value={card._id}>{card.title}</option>
		)}
	</select> : null;

const CardSelectContainer = createContainer(
	({skip = []}) => ({
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}}).fetch(), '_id'),
	}),
	CardSelect
);

export default CardSelectContainer;
