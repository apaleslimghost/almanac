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
import Splash from './splash';
import {Campaign} from '../../shared/methods';

const withCampaignData = withTracker(() => ({
	ready: subscribe('campaigns.all'),
	campaigns: Campaigns.find({}).fetch(),
}));

const withCampaignActions = withHandlers({
	createCampaign: () => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Campaign.create(data, (err, {_id}) => go(`/${_id}`));
	},
});

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
		<Link href='/new-campaign'>Add a campaign</Link>
	</li>
</ul>);
