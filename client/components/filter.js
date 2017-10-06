import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';

import DatePicker from './date-picker';
import {Padded} from './primitives';

export default createContainer(() => ({
	setDate(date) {
		SyncedSession.set('timestamp', date.timestamp);
	},

	timestamp: SyncedSession.get('timestamp'),
}), ({timestamp, setDate}) => <Padded>
	<DatePicker timestamp={(console.log(timestamp), timestamp)} onChange={setDate} />
	{timestamp}
</Padded>);
