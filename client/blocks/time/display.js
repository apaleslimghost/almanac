import React from 'react';
import styled, {css} from 'styled-components';
import {H1, H2, H3} from '../../visual/heading';
import connectTime from './connect/time';

import Ornamented, {bordered} from '../../visual/ornamented';

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

const ornaments = [
	'h', 'f', 'a', 't', 'n', 'c', 'o', 'p', 'e', 'r', 'k', 'l'
];

const OrnamentedMonth = ({date}) => <Ornamented ornament={ornaments[date.monthIndex]} large>
	<Compact>
		<div>{date.format`${'dddd'} ${'Do'}`}</div>
		<small>{date.format`${'MMMM'}`}</small>
	</Compact>
</Ornamented>;

const Time = connectTime(({date}) => <DateGroup>
	<OrnamentedMonth date={date} />
	<TimeOfDay>{date.format`${'h'}:${'mm'}`}<small>{date.a}</small></TimeOfDay>
	<Year><span>{date.YYYY}</span></Year>
</DateGroup>);

export default Time;
