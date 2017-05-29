import React from 'react';
import OdreianDate from 'odreian-date';
import {observe} from '../store';
import orderBy from 'lodash.orderby';
import values from 'lodash.values';
import {H1, H2} from './heading';

const CompletedObjectives = observe((props, {subscribe}) => {
	const objectives = values(subscribe('objectives', {}));

	return <div>
		<H1>Completed</H1>
		<ul>{orderBy(objectives.filter(({completed}) => completed), 'completedDate', 'desc').map(objective =>
			<li key={objective.id}>
				<b>{objective.quest}</b> {objective.text}
				<div>✔ <time>{new OdreianDate(objective.completedDate).llll}</time></div>
			</li>
		)}</ul>
	</div>;
});

export {
	CompletedObjectives as display,
	CompletedObjectives as control
};
