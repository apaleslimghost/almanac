import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import formJson from '@quarterto/form-json';
import {compose, withHandlers, renderComponent} from 'recompact';

import {Campaigns} from '../../shared/collections';
import Link from '../control/link';
import {go} from '../utils/router';
import subscribe from '../utils/subscribe';
import withLoading from '../control/loading';
import loggedIn from '../utils/logged-in';
import Splash from './splash';
import {Campaign} from '../../shared/methods';
import {SplashBackground, Hero, HeroTitle, HeroBlurb} from '../visual/splash';
import {FlexGrid} from '../visual/grid';
import connectSplashImage from '../data/splash';

const withCampaignData = withTracker(() => ({
	ready: subscribe('campaigns.all'),
	campaigns: Campaigns.find({}).fetch(),
}));

const connectCampaign = compose(
	loggedIn(renderComponent(Splash)),
	withCampaignData,
	withLoading
);

const CampaignTile = connectSplashImage(SplashBackground.withComponent(Link).extend`
	height: 25vmin;
	border-radius: 3px;
	text-decoration: none;
	transition: filter 0.2s;
	will-change: filter;

	&:hover {
		filter: contrast(120%) brightness(95%) saturate(110%);
	}
`);

export default connectCampaign(({campaigns, ownerUser}) => <FlexGrid>
	{campaigns.map(
		campaign => <CampaignTile campaign={campaign} href={`/${campaign._id}`} key={campaign._id}>
			<Hero>
				<HeroTitle>{campaign.title}</HeroTitle>
				<HeroBlurb>{campaign.tagline}</HeroBlurb>
			</Hero>
		</CampaignTile>
	)}

	<Link href='/new-campaign'>Add a campaign</Link>
</FlexGrid>);
