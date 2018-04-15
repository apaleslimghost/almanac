import React from 'react';
import CardList from '../collection/card-list';
import {compose, withPropsOnChange} from 'recompact';
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
