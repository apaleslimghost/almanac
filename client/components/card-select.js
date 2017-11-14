import {Meteor} from 'meteor/meteor'
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';

import {Cards} from '../../shared/collections';
import {getSelectValue} from './form';
import {withCampaign} from './campaign';

//TODO: typeahead?

const CardSelect = ({cardsById, onSelect}) =>
	_.size(cardsById)
		? <select value=''
			onChange={ev => onSelect(cardsById[getSelectValue(ev.target)])}>
			<option disabled value="" />
			{_.map(cardsById, card =>
				<option key={card._id} value={card._id}>{card.title}</option>
			)}
		</select>
		: null;

const CardSelectContainer = withCampaign(createContainer({
	pure: false,
	getMeteorData: ({skip = [], campaignId}) => ({
		ready: Meteor.subscribe('cards.all').ready(),
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}, campaignId}).fetch(), '_id'),
	}),
}, CardSelect));

export default CardSelectContainer;
