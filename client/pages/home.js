import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Campaigns} from '../../shared/collections';
import {List} from '../visual/primitives';
import Link from '../control/link';
import {go} from '../utils/router';
import formJson from '@quarterto/form-json';
import generateSlug from '../utils/generate-slug';
import {calendarList} from '../data/calendar';

const withCampaignData = withTracker(() => ({
	campaigns: Campaigns.find({}).fetch(),
	createCampaign(ev, quest) {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Campaigns.insert(
			generateSlug(data),
			(err, id) => go(`/${id}`)
		);
	},
}));

export default withCampaignData(({campaigns, createCampaign}) => <ul>
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
