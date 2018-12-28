import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { compose, renderComponent } from 'recompact'

import { Campaigns } from '../../shared/collections'
import Link from '../control/link'
import subscribe from '../utils/subscribe'
import withLoading from '../control/loading'
import loggedIn from '../utils/logged-in'
import { SplashBackground, Hero, HeroTitle, HeroBlurb } from '../visual/splash'
import { FlexGrid } from '../visual/grid'
import connectSplashImage from '../data/splash'
import Splash from './splash'

const withCampaignData = withTracker(() => ({
	ready: subscribe('campaigns.all'),
	campaigns: Campaigns.find({}).fetch()
}))

const connectCampaign = compose(
	loggedIn(renderComponent(Splash)),
	withCampaignData,
	withLoading
)

const CampaignTile = connectSplashImage(SplashBackground.withComponent(Link)
	.extend`
	height: 25vmin;
	border-radius: 3px;
	text-decoration: none;
	transition: filter 0.2s;
	will-change: filter;

	&:hover {
		filter: contrast(120%) brightness(95%) saturate(110%);
	}
`)

export default connectCampaign(({ campaigns, ownerUser }) => (
	<FlexGrid>
		{campaigns.map(campaign => (
			<CampaignTile
				key={campaign._id}
				campaign={campaign}
				href={`/${campaign._id}`}
			>
				<Hero>
					<HeroTitle>{campaign.title}</HeroTitle>
					<HeroBlurb>{campaign.tagline}</HeroBlurb>
				</Hero>
			</CampaignTile>
		))}

		<Link href='/new-campaign'>Add a campaign</Link>
	</FlexGrid>
))
