import {Meteor} from 'meteor/meteor'
import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import _ from 'lodash';
import {compose} from 'recompact';

import {Cards} from '../../../shared/imports/collections';
import {getSelectValue} from '../control/form';
import {Select} from '../visual/form';
import {withCampaign} from '../data/campaign';
import subscribe from '../utils/subscribe';

//TODO: typeahead?

const CardSelect = ({cardsById, onSelect, placeholder}) =>
	_.size(cardsById)
		? <Select value=''
			onChange={ev => onSelect(cardsById[getSelectValue(ev.target)])}>
			<option disabled value=''>{placeholder}</option>
			{_.map(cardsById, card =>
				<option key={card._id} value={card._id}>{card.title}</option>
			)}
		</Select>
		: null;

const withCardData = withTracker({
	pure: false,
	getMeteorData: ({skip = [], campaignId}) => ({
		ready: subscribe('cards.all'),
		//TODO: use withCard
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}, campaignId}).fetch(), '_id'),
	}),
});

const connectCardSelect = compose(withCampaign, withCardData);

export default connectCardSelect(CardSelect);
