import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import getCampaignSession from '../../shared/session';
import {withCampaignSession} from '../components/collection/campaign';
import {compose} from 'recompose';

import DatePicker from './date-picker';
import {Padded} from './visual/primitives';

const withDateData = withTracker(({campaignSession}) => ({
	setDate(date) {
		campaignSession.set('timestamp', date.timestamp);
	},

	timestamp: campaignSession.get('timestamp'),
}));

const connectFilter = compose(
	withCampaignSession,
	withDateData
);

export default connectFilter(({timestamp, setDate}) => <Padded>
	<DatePicker timestamp={timestamp} onChange={setDate} />
	{timestamp}
</Padded>);
