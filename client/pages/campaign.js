import React, {Fragment} from 'react';
import {withCampaignData, withCampaignSession} from '../data/campaign';
import {compose, withPropsOnChange} from 'recompact';
import styled from 'styled-components';
import {SplashBleed, Hero, HeroTitle, HeroBlurb} from '../visual/splash';
import Title from '../utils/title';
import CardList from '../collection/card-list';
import connectSplashImage from '../data/splash';
import withOwnerData from '../data/owner';

const Splash = connectSplashImage(SplashBleed);

const connectCampaign = compose(
	withCampaignData,
	withOwnerData('campaign')
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

export default connectCampaign(({campaign, ownerUser}) => <Fragment>
	<Title>{campaign.title}</Title>

	<Splash campaign={campaign}>
		<Hero>
			<HeroTitle>{campaign.title}</HeroTitle>
			<HeroBlurb>{campaign.tagline || `A campaign by ${ownerUser.username}`}</HeroBlurb>
		</Hero>
	</Splash>

	<Grail />
</Fragment>);
