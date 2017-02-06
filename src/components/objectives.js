import React from 'react';
import OdreianDate from 'odreian-date'
import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import values from 'lodash.values';
import orderBy from 'lodash.orderby';
import {observe} from '../store';

const Objectives = observe((props, {subscribe}) => {
	const objectives = values(subscribe('objectives', {}));

	return <div>
		<h1>Objectives</h1>
		{map(groupBy(objectives.filter(({completed}) => !completed), 'quest'), (objectives, name) => <div>
			<h2>{name}</h2>
			<ul>{objectives.map(objective => <li key={objective.text}>{objective.text}</li>)}</ul>
		</div>)}

		<h2>Completed</h2>
		<ul>{orderBy(objectives.filter(({completed}) => completed), 'completedDate', 'desc').map(objective =>
			<li key={objective.text}>
				<b>{objective.quest}</b> {objective.text} 
				<div>✔ <time>{new OdreianDate(objective.completedDate).llll}</time></div>
			</li>
		)}</ul>
	</div>;
});

export default Objectives;