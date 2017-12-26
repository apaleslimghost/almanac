import {Meteor} from 'meteor/meteor'
import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import _ from 'lodash';
import {compose} from 'recompose';

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

const withCardData = withTracker({
	pure: false,
	getMeteorData: ({skip = [], campaignId}) => ({
		ready: Meteor.subscribe('cards.all').ready(),
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}, campaignId}).fetch(), '_id'),
	}),
});

const connectCardSelect = compose(withCampaign, withCardData);

export default connectCardSelect(CardSelect);
