import React from 'react';
import OdreianDate from 'odreian-date'
import styled, {css} from 'styled-components';
import {H1, H2, H3} from '../components/heading';
import withState from '../components/state';
import getCampaignSession from '../../shared/session';
import {withTracker} from 'meteor/react-meteor-data';
import {withCampaign} from '../components/campaign';

import Ornamented, {bordered} from '../components/ornamented';

const TimeOfDay = styled(H1)`
margin: 0;
font-size: 6em;
line-height: 1;
letter-spacing: -0.1em;
font-weight: normal;
`;

const Year = styled(H3)`
${bordered}
font-family: 'Libre Baskerville', serif;
font-variant: normal;
margin: 0;
`;

const DateGroup = styled.time`
text-align: center;
`;

const Compact = styled.div`
line-height: 0.8;
`;

const TimeButton = styled.button`
border: 2px solid #55C;
border-right: 0 none;
background: none;
font-size: 10px;
cursor: pointer;

&:first-child {
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
}

&:last-child {
	border: 2px solid #55C;
	border-top-right-radius: 3px;
	border-bottom-right-radius: 3px;
}

&:hover {
	background: rgba(85, 85, 204, 0.1);
}
`;

const Controls = styled.div`
line-height: 1;
`;

const ornaments = [
	'h', 'f', 'a', 't', 'n', 'c', 'o', 'p', 'e', 'r', 'k', 'l'
];

const OrnamentedMonth = ({date}) => <Ornamented ornament={ornaments[date.monthIndex]} large>
	<Compact>
		<div>{date.format`${'dddd'} ${'Do'}`}</div>
		<small>Month of {date.format`${'MM'}`}</small>
	</Compact>
</Ornamented>;

const Time = ({date}) => <DateGroup>
	<OrnamentedMonth date={date} />
	<TimeOfDay>{date.format`${'h'}:${'mm'}`}<small>{date.a}</small></TimeOfDay>
	<Year><span>{date.YYYY}</span></Year>
</DateGroup>;

const pluralize = (word, n) => Math.abs(n) > 1 ? `${word}s` : word;

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

const withIncrement = withTracker(({session, period, multiplier = 1}) => ({
	onIncrement() {
		const date = session.get('date') || 0;
		session.set('date', date + secondsIn[period] * multiplier);
	},
}));

const Inc = withIncrement(({onIncrement, multiplier = 1, period}) => <TimeButton
	onClick={onIncrement}>
	{multiplier > 0 && '+'}{multiplier}{period[0]}
</TimeButton>);

const DateForm = withState(({date}) => ({date}), ({date, onSubmit}, state, setState) => <div>
	<input value={state.date || date} onChange={ev => setState({date: ev.target.value})} size={35} />
	<button onClick={() => onSubmit(OdreianDate.parse(state.date).timestamp)}>Set</button>
</div>);

const connectDateForm = withTracker(({session}) => ({
	date: new OdreianDate(session.get('date') || 0).llll,
	onSubmit(date) {
		session.set('date', date);
	},
}));

const DateFormConnector = connectDateForm(DateForm);

const connectTime = withTracker(({campaignId}) => {
	const session = getCampaignSession(campaignId);
	return {
		date: new OdreianDate(session.get('date') || 0),
		session,
	};
});

const TimeContainer = withCampaign(connectTime(Time));
const TimeControl = withCampaign(connectTime(({date, session}) => <div>
	<Time date={date} />

	<Controls>
		<div>
			<Inc session={session} period='minute' />
			<Inc session={session} period='minute' multiplier={5} />
			<Inc session={session} period='minute' multiplier={15} />
			<Inc session={session} period='minute' multiplier={30} />
		</div>

		<div>
			<Inc session={session} period='hour' />
			<Inc session={session} period='hour' multiplier={2} />
			<Inc session={session} period='hour' multiplier={4} />
			<Inc session={session} period='hour' multiplier={8} />
			<Inc session={session} period='hour' multiplier={12} />
		</div>

		<div>
			<Inc session={session} period='day' />
			<Inc session={session} period='day' multiplier={2} />
		</div>

		<div>
			<Inc session={session} period='week' />
			<Inc session={session} period='week' multiplier={2} />
		</div>

		<div>
			<Inc session={session} period='month' />
			<Inc session={session} period='month' multiplier={2} />
			<Inc session={session} period='month' multiplier={6} />
		</div>

		<div>
			<Inc session={session} period='year' />
			<Inc session={session} period='year' multiplier={2} />
		</div>

		<DateFormConnector session={session} />
	</Controls>
</div>));

export {
	TimeContainer as display,
	TimeControl as control
};
