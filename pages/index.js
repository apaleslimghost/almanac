import React from 'react';
import {observe} from '../src/store';
import OdreianDate from 'odreian-date'

const Time = observe((props, {subscribe}) => {
	const date = new OdreianDate(subscribe('date'));
	return <time>
		<h1>{date.LT}</h1>
		<h2>{date.format`${'dddd'}, ${'Do'} of ${'MMMM'}`}</h2>
		<h3>{date.YYYY}</h3>
	</time>;
});

export default Time;