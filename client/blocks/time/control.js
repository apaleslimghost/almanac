import React from 'react';
import Time from './display';
import {withCampaignSession} from '../../components/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import connectTime from './connect/time';
import {compose, withState, withHandlers} from 'recompose';
import {Button} from '../../components/primitives';
import OdreianDate from 'odreian-date'

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

const Inc = connectIncrement(({onIncrement, multiplier = 1, period}) => <Button
	onClick={onIncrement}>
	{multiplier > 0 && '+'}{multiplier}{period[0]}
</Button>);

const withDateActions = withHandlers({
	onSubmit: ({campaignSession, date}) => ev => {
		campaignSession.set(
			'date',
			OdreianDate.parse(date).timestamp
		);
	},
});

const withDateState = withState(
	'date',
	'setDate',
	({date}) => date.llll
);

const connectDateForm = compose(
	withCampaignSession,
	connectTime,
	withDateState,
	withDateActions
);

const DateForm = connectDateForm(({date, setDate, onSubmit}) => <div>
	<input value={date} onChange={ev => setDate(ev.target.value)} size={35} />
	<button onClick={() => onSubmit()}>Set</button>
</div>);

const TimeControl = () => <div>
	<Time />

	<div>
		<Inc period='minute' />
		<Inc period='minute' multiplier={5} />
		<Inc period='minute' multiplier={10} />
		<Inc period='minute' multiplier={30} />
	</div>

	<div>
		<Inc period='hour' />
		<Inc period='hour' multiplier={8} />
	</div>

	<div>
		<Inc period='day' />
	</div>

	<DateForm />
</div>;

export default TimeControl;
