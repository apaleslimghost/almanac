import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import getCampaignSession from '../../shared/session';
import {withCampaign} from '../components/campaign';

import DatePicker from './date-picker';
import {Padded} from './primitives';

export default withCampaign(createContainer(({campaignId}) => {
	const session = getCampaignSession(campaignId);
	return {
		setDate(date) {
			session.set('timestamp', date.timestamp);
		},

		timestamp: session.get('timestamp'),
	};
}, ({timestamp, setDate}) => <Padded>
	<DatePicker timestamp={timestamp} onChange={setDate} />
	{timestamp}
</Padded>));
