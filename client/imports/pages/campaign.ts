import React from 'react';
import {withCampaignData, withCampaignSession} from '../data/campaign';
import {compose, withPropsOnChange} from 'recompact';
import styled from 'styled-components';
import {CampaignSplash} from '../visual/splash';
import Title from '../utils/title';
import CardList from '../collection/card-list';

const connectCampaign = compose(
	withCampaignData,
);

const selectCard = withPropsOnChange(
	['selectCard'], ({selectCard, campaignSession}) => {
		campaignSession.set('selectedCard', selectCard);
	}
);

const connectGrail = compose(
	withCampaignSession,
	selectCard
);

const Grail = connectGrail(CardList);

export default withCampaignData(({campaign}) => <>
	<Title>{campaign.title}</Title>

	<CampaignSplash />
	<Grail />
</>);
