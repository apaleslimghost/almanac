import React from 'react';
import OdreianDate from 'odreian-date'
import styled from 'styled-components';
import {observe} from '../store';
import {H1, H2, H3} from './heading';

const TimeOfDay = styled(H1)`
margin: 0;
`;

const DateLine = styled(H2)`
font-family: MrsEavesRoman;
margin: 0;
`;

const Year = styled(H3)`
font-family: MrsEavesRoman;
margin: 0;
`;

const Time = observe((props, {subscribe}) => {
	const date = new OdreianDate(subscribe('date'));
	return <time>
		<TimeOfDay>{date.LT}</TimeOfDay>
		<DateLine>{date.format`${'dddd'}, ${'Do'} of ${'MMMM'}`}</DateLine>
		<Year>{date.YYYY}</Year>
	</time>;
});

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

const Inc = observe(({period, multiplier = 1}, {dispatch}) => <TimeButton
	onClick={() => dispatch('date', date => date + secondsIn[period] * multiplier)}>
	{multiplier > 0 && '+'}{multiplier} {pluralize(period, multiplier)}
</TimeButton>);

const TimeControl = observe((props, {dispatch, subscribe}) => <div>
	<Time />

	<hr />

	<div style={{textAlign: 'center'}}>
		<div>
			<Inc period='minute' multiplier={-30} />
			<Inc period='minute' multiplier={-5} />
			<Inc period='minute' multiplier={-1}/>
			<Inc period='minute' />
			<Inc period='minute' multiplier={5} />
			<Inc period='minute' multiplier={30} />
		</div>

		<div>
			<Inc period='hour' multiplier={-12} />
			<Inc period='hour' multiplier={-6} />
			<Inc period='hour' multiplier={-2} />
			<Inc period='hour' multiplier={-1}/>
			<Inc period='hour' />
			<Inc period='hour' multiplier={2} />
			<Inc period='hour' multiplier={6} />
			<Inc period='hour' multiplier={12} />
		</div>

		<div>
			<Inc period='day' multiplier={-2} />
			<Inc period='day' multiplier={-1}/>
			<Inc period='day' />
			<Inc period='day' multiplier={2} />
		</div>

		<div>
			<Inc period='week' multiplier={-2} />
			<Inc period='week' multiplier={-1}/>
			<Inc period='week' />
			<Inc period='week' multiplier={2} />
		</div>

		<div>
			<Inc period='month' multiplier={-6} />
			<Inc period='month' multiplier={-2} />
			<Inc period='month' multiplier={-1}/>
			<Inc period='month' />
			<Inc period='month' multiplier={2} />
			<Inc period='month' multiplier={6} />
		</div>

		<div>
			<Inc period='year' multiplier={-10} />
			<Inc period='year' multiplier={-5} />
			<Inc period='year' multiplier={-2} />
			<Inc period='year' multiplier={-1}/>
			<Inc period='year' />
			<Inc period='year' multiplier={2} />
			<Inc period='year' multiplier={5} />
			<Inc period='year' multiplier={10} />
		</div>

		<div>
			<input defaultValue={subscribe('date')} onChange={ev => dispatch('_date', () => parseInt(ev.target.value, 0))} />
			<button onClick={() => dispatch('date', () => subscribe('_date'))}>Set</button>
		</div>
	</div>
</div>);

export {
	Time as display,
	TimeControl as control
};