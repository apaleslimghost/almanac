import React from 'react';
import {observe} from '../src/store';
import OdreianDate from 'odreian-date'
import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import values from 'lodash.values';

const Time = observe((props, {subscribe}) => {
	const date = new OdreianDate(subscribe('date'));
	return <time>
		<h1>{date.LT}</h1>
		<h2>{date.format`${'dddd'}, ${'Do'} of ${'MMMM'}`}</h2>
		<h3>{date.YYYY}</h3>
	</time>;
});

const Objectives = observe((props, {subscribe}) => {
	const objectives = values(subscribe('objectives', {}));

	return <div>
		<h1>Objectives</h1>
		{map(groupBy(objectives.filter(({completed}) => !completed), 'quest'), (objectives, name) => <div>
			<h2>{name}</h2>
			<ul>{objectives.map(objective => <li key={objective.text}>{objective.text}</li>)}</ul>
		</div>)}

		<h2>Completed</h2>
		<ul>{objectives.filter(({completed}) => completed).map(objective => <li key={objective.text}>✔ <b>{objective.quest}</b> {objective.text}</li>)}</ul>
	</div>;
});

export default () => <div>
	<Time />
	<Objectives />
</div>;