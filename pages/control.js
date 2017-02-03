import React from 'react';
import {observe} from '../src/store';
import pluralize from 'pluralize';

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

const Inc = observe(({period, multiplier = 1}, {dispatch}) => <button
	onClick={() => dispatch('date', date => date + secondsIn[period] * multiplier)}>
	+{multiplier} {pluralize(period, multiplier)}
</button>);

export default observe((props, {dispatch, subscribe}) => <main>
	<div>
		<Inc period='minute' />
		<Inc period='minute' multiplier={5} />
		<Inc period='minute' multiplier={30} />
	</div>

	<div>
		<Inc period='hour' />
		<Inc period='hour' multiplier={2} />
		<Inc period='hour' multiplier={6} />
		<Inc period='hour' multiplier={12} />
	</div>

	<div>
		<Inc period='day' />
		<Inc period='day' multiplier={2} />
	</div>

	<div>
		<Inc period='week' />
		<Inc period='week' multiplier={2} />
	</div>

	<div>
		<Inc period='month' />
		<Inc period='month' multiplier={2} />
		<Inc period='month' multiplier={6} />
	</div>

	<div>
		<Inc period='year' />
		<Inc period='year' multiplier={2} />
		<Inc period='year' multiplier={5} />
		<Inc period='year' multiplier={10} />
	</div>

	<div>
		<input defaultValue={subscribe('date')} onChange={ev => dispatch('_date', () => ev.target.value)} />
		<button onClick={() => dispatch('date', () => subscribe('_date'))}>Set</button>
	</div>
</main>);