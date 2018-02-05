import {withHandlers} from 'recompose';

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

export default withHandlers({
	onIncrement: ({
		campaignSession,
		period,
		multiplier = 1,
		amount = secondsIn[period] * multiplier
	}) => () => {
		campaignSession.set(
			'date',
			(
				campaignSession.get('date') || 0
			) + amount
		);
	},
});
