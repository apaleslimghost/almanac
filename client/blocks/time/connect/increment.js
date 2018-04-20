import {withHandlers} from 'recompose';
import OdreianDate from 'dream-date/calendar/odreian';

export default withHandlers({
	onIncrement: ({
		campaignSession,
		period,
		multiplier = 1
	}) => () => {
		campaignSession.set(
			'date',
			new OdreianDate(campaignSession.get('date') || 0).add({
				[period]: multiplier
			}).timestamp
		);
	},
});
