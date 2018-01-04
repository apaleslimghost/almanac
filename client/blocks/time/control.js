import React from 'react';
import Time from './display';
import {withCampaignSession} from '../../components/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import connectTime from './connect/time';
import {compose, withState, withHandlers, withPropsOnChange} from 'recompose';
import {Button, List, Input, Group} from '../../components/primitives';
import OdreianDate from 'odreian-date';
import preventingDefault from '../../preventing-default';

// TODO: this all needs to be exported from OdreianDate
const secondsInMinute = 60;
const minutesInHour = 60;
const hoursInDay = 24;
const daysInMonth = 30;
const daysInWeek = 6;
const monthsInYear = 12;

const secondsInHour = secondsInMinute * minutesInHour;
const secondsInDay = secondsInHour * hoursInDay;
const secondsInWeek = secondsInDay * daysInWeek;
const secondsInMonth = secondsInDay * daysInMonth;
const secondsInYear = secondsInMonth * monthsInYear;

const secondsIn = {
	minute: secondsInMinute,
	hour: secondsInHour,
	day: secondsInDay,
	week: secondsInWeek,
	month: secondsInMonth,
	year: secondsInYear,
};

const withIncrement = withHandlers({
	onIncrement: ({campaignSession, period, multiplier = 1}) => () => {
		campaignSession.set(
			'date',
			(
				campaignSession.get('date') || 0
			) + secondsIn[period] * multiplier
		);
	},
});

const connectIncrement = compose(
	withCampaignSession,
	withIncrement
);

const Inc = connectIncrement(({onIncrement, multiplier = 1, period}) => <Button large={false} colour='steel' onClick={onIncrement}>
	{multiplier > 0 && '+'}{multiplier}{period[0]}
</Button>);

const withDateActions = withHandlers({
	onSubmit: ({campaignSession, _date}) => ev => {
		campaignSession.set(
			'date',
			OdreianDate.parse(_date).timestamp
		);
	},
});

const withDateState = withState(
	'_date',
	'setDate',
	({date}) => date.llll
);

const connectDateForm = compose(
	withCampaignSession,
	connectTime,
	withDateState,
	withDateActions,
	withPropsOnChange(['date'], ({date, setDate}) => {
		setDate(date.llll);
	})
);

const DateForm = connectDateForm(({_date, setDate, onSubmit}) => <form onSubmit={preventingDefault(onSubmit)}>
	<Input value={_date} onChange={ev => setDate(ev.target.value)} size={35} />
	<Button>Set</Button>
</form>);

const TimeControl = () => <div>
	<Time />

	<List>
		<Group>
			<Inc period='minute' />
			<Inc period='minute' multiplier={5} />
			<Inc period='minute' multiplier={10} />
			<Inc period='minute' multiplier={30} />
		</Group>

		<Group>
			<Inc period='hour' />
			<Inc period='hour' multiplier={8} />
		</Group>

		<Group>
			<Inc period='day' />
		</Group>
	</List>

	<DateForm />
</div>;

export default TimeControl;
