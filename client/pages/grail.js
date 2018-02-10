import React from 'react';
import CardList from '../collection/card-list';
import Filter from '../control/filter';
import {compose, withPropsOnChange} from 'recompose';
import {withCampaignSession} from '../data/campaign';

const selectCard = withPropsOnChange(
	['selectCard'], ({selectCard, campaignSession}) => {
		campaignSession.set('selectedCard', selectCard);
	}
);

const connectGrail = compose(
	withCampaignSession,
	selectCard
);

export default connectGrail(CardList);
