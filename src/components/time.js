import React from 'react';
import OdreianDate from 'odreian-date'
import styled, {css} from 'styled-components';
import {observe} from '../store';
import {H1, H2, H3} from './heading';
import withState from './state';

const bordered = css`
position: relative;

&:before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 1px;
	margin-top: -1px;
	background: black;
	z-index: 1;
}

> * {
	position: relative;
	background: white;
	z-index: 2;
}
`;

const TimeOfDay = styled(H1)`
margin: -0.2em 0 0 -0.15em;
font-size: 6em;
line-height: 1;
letter-spacing: -0.1em;
font-weight: normal;
`;

const DateLine = styled(H2)`
font-family: MrsEavesRoman;
margin: 0;
`;

const Year = styled(H3)`
${bordered}
font-family: MrsEavesRoman;
margin: 0;
`;

const Date = styled(DateLine)`
display: flex;
align-items: center;
justify-content: center;

${bordered}
`;

const DateGroup = styled.time`
text-align: center;
`;

const Ornament = styled.span`
font-family: 'PC Ornaments';
font-size: 2em;
`;

const Compact = styled.div`
line-height: 0.8;
`;

const ornaments = [
	'h', 'f', 'a', 't', 'n', 'c', 'o', 'p', 'e', 'r', 'k', 'l'
];

const OrnamentedMonth = ({date}) => <Date>
	<Ornament>{ornaments[date.monthIndex]}</Ornament>
	<Compact>
		<div>{date.format`${'dddd'} ${'Do'}`}</div>
		<small>Month of {date.format`${'MM'}`}</small>
	</Compact>
	<Ornament>{ornaments[date.monthIndex].toUpperCase()}</Ornament>
</Date>;

const Time = observe((props, {subscribe}) => {
	const date = new OdreianDate(subscribe('date'));
	return <DateGroup>
		<OrnamentedMonth date={date} />
		<TimeOfDay>{date.format`${'h'}:${'mm'}`}<small>{date.a}</small></TimeOfDay>
		<Year><span>{date.YYYY}</span></Year>
	</DateGroup>;
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

const Controls = styled.div`
text-align: center;
line-height: 1;
`;

const Inc = observe(({period, multiplier = 1}, {dispatch}) => <TimeButton
	onClick={() => dispatch('date', date => date + secondsIn[period] * multiplier)}>
	{multiplier > 0 && '+'}{multiplier}{period[0]}
</TimeButton>);


const DateForm = withState(({date}) => ({date}), ({date, onSubmit}, state, setState) => <div>
	<input value={state.date || date} onChange={ev => setState({date: ev.target.value})} size={35} />
	<button onClick={() => onSubmit(OdreianDate.parse(state.date).timestamp)}>Set</button>
</div>);

const DateFormConnector = observe((props, {subscribe, dispatch}) => <DateForm
	date={new OdreianDate(subscribe('date')).llll}
	onSubmit={date => dispatch('date', () => date)}
/>);

const reverse = ([x, ...xs]) => xs.length ? reverse(xs).concat(x) : [];

const Checkpoints = observe((props, {subscribe, dispatch}) => {
	const date = subscribe('date');

	return <div>
		<button onClick={() => dispatch('checkpoints', c => c.concat(date))}>Save checkpoint</button>

		<ul>
			{reverse(subscribe('checkpoints')).map(
				point => <li key={point}>
					<button onClick={() => dispatch('date', () => point)}>Restore</button>
					<button onClick={() => dispatch('checkpoints', c => c.filter(p => p !== point))}>×</button>
					{new OdreianDate(point).llll}
				</li>
			)}
		</ul>
	</div>;
});

const TimeControl = observe((props, {dispatch, subscribe}) => <div>
	<Time />

	<hr />

	<Controls>
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

		<DateFormConnector />
		<Checkpoints />
	</Controls>
</div>);

export {
	Time as display,
	TimeControl as control
};
