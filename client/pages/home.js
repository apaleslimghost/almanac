import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Campaigns} from '../../shared/collections';
import {List} from '../components/visual/primitives';
import Link from '../components/link';
import {go} from '../router';
import formJson from '@quarterto/form-json';

const withCampaignData = withTracker(() => ({
	campaigns: Campaigns.find({}).fetch(),
	createCampaign(ev, quest) {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Campaigns.insert(data, (err, id) => {
			go(`/${id}`);
		});
	},
}));

export default withCampaignData(({campaigns, createCampaign}) => <ul>
	{campaigns.map(campaign => <li key={campaign._id}>
		<Link href={`/${campaign._id}`}>{campaign.title}</Link>
	</li>)}

	<li>
		<form onSubmit={createCampaign}>
			<input placeholder='Campaign' name='title' />
			<button>➕</button>
		</form>
	</li>
</ul>);
