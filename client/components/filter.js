import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import getCampaignSession from '../../shared/session';

import DatePicker from './date-picker';
import {Padded} from './primitives';

export default createContainer(({campaignId}) => {
	const session = getCampaignSession(campaignId);
	return {
		setDate(date) {
			session.set('timestamp', date.timestamp);
		},

		timestamp: session.get('timestamp'),
	};
}, ({timestamp, setDate}) => <Padded>
	<DatePicker timestamp={(console.log(timestamp), timestamp)} onChange={setDate} />
	{timestamp}
</Padded>);
