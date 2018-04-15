import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Campaigns} from '../../shared/collections';
import {List} from '../visual/primitives';
import Link from '../control/link';
import {go} from '../utils/router';
import formJson from '@quarterto/form-json';
import {Meteor} from 'meteor/meteor';
import subscribe from '../utils/subscribe';
import {compose, withHandlers, renderComponent} from 'recompact';
import withLoading from '../control/loading';
import generateSlug from '../../shared/utils/generate-slug';
import loggedIn from '../utils/logged-in';
import styled from 'styled-components';
import {hidesNav} from './layout';
import Logo from '../visual/logo';
import {LabelledInput, LabelButton, Input} from '../visual/primitives';
import {calendarList} from '../data/calendar';

const withCampaignData = withTracker(() => ({
	ready: subscribe('campaigns.all'),
	campaigns: Campaigns.find({}).fetch(),
}));

const withCampaignActions = withHandlers({
	createCampaign: () => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Meteor.call('createCampaign', data, (err, {_id}) => go(`/${_id}`));
	},
});

const SplashBackground = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;

	width: 100vw;
	height: 60vw;
	max-height: 60vh;

	background-size: cover;
	background-position: center;

	background-image:
		linear-gradient(rgba(0, 20, 40, 0) 40%, rgba(0, 20, 40, 0.9)),
		url(/images/splash.jpg);

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		background-image:
			linear-gradient(rgba(0, 20, 40, 0) 40%, rgba(0, 20, 40, 0.9)),
			url(/images/splash@2x.jpg);
	}
`;

const Hero = styled.div`
	color: white;
`;

const HeroTitle = styled.h2`
	font-family: 'Libre Baskerville', serif;
	font-size: 2.4em;
	font-weight: normal;
	text-align: center;
`;

const HeroBlurb = styled.p`
	font-family: 'Libre Baskerville', serif;
	text-align: right;
	margin-right: 1em;
	padding-right: 1em;
	border-right: 1px solid white;
`;

const Split = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 600px;
	margin: 0 auto;
`

const Splash = hidesNav(() => <SplashBackground>
	<Logo large />
	<Hero>
		<HeroTitle>The sandbox RPG app.</HeroTitle>

		<Split>
			<HeroBlurb>Everything you need to run a sandbox tabletop RPG & get your players involved in your world.</HeroBlurb>
			<div>
				<LabelledInput>
					<Input />
					<LabelButton>Start your campaign</LabelButton>
				</LabelledInput>

				<p>or, <a>log in</a>.</p>
			</div>
		</Split>
	</Hero>
</SplashBackground>);

const connectCampaign = compose(
	loggedIn(renderComponent(Splash)),
	withCampaignData,
	withCampaignActions,
	withLoading
);

export default connectCampaign(({campaigns, createCampaign}) => <ul>
	{campaigns.map(campaign => <li key={campaign._id}>
		<Link href={`/${campaign._id}`}>{campaign.title}</Link>
	</li>)}

	<li>
		<form onSubmit={createCampaign}>
			<input placeholder='Campaign' name='title' />
			<select name='calendar'>
				<option value=''>Select Calendar System</option>
				{calendarList.map(calendar => <option value={calendar.id} key={calendar.id}>
					{calendar.name}
				</option>)}
			</select>
			<button>➕</button>
		</form>
	</li>
</ul>);
