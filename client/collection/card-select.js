import {Meteor} from 'meteor/meteor'
import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import _ from 'lodash';
import {compose} from 'recompose';

import {Cards} from '../../shared/collections';
import {getSelectValue} from '../control/form';
import {withCampaign} from '../data/campaign';

//TODO: typeahead?

const CardSelect = ({cardsById, onSelect, tag: Tag = 'select', placeholder}) =>
	_.size(cardsById)
		? <Tag value=''
			onChange={ev => onSelect(cardsById[getSelectValue(ev.target)])}>
			<option disabled value=''>{placeholder}</option>
			{_.map(cardsById, card =>
				<option key={card._id} value={card._id}>{card.title}</option>
			)}
		</Tag>
		: null;

const withCardData = withTracker({
	pure: false,
	getMeteorData: ({skip = [], campaignId}) => ({
		ready: Meteor.subscribe('cards.all').ready(),
		//TODO: use withCard
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}, campaignId}).fetch(), '_id'),
	}),
});

const connectCardSelect = compose(withCampaign, withCardData);

export default connectCardSelect(CardSelect);
