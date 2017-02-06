import React from 'react';
import OdreianDate from 'odreian-date'
import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import values from 'lodash.values';
import orderBy from 'lodash.orderby';
import formJson from '@quarterto/form-json';
import shortId from '@quarterto/short-id';
import {observe} from '../store';
import {H1, H2} from './heading';

const CompletedObjectives = ({objectives}) => <div>
	<H2>Completed</H2>
	<ul>{orderBy(objectives.filter(({completed}) => completed), 'completedDate', 'desc').map(objective =>
		<li key={objective.text}>
			<b>{objective.quest}</b> {objective.text} 
			<div>✔ <time>{new OdreianDate(objective.completedDate).llll}</time></div>
		</li>
	)}</ul>
</div>;

const Objectives = observe((props, {subscribe}) => {
	const objectives = values(subscribe('objectives', {}));

	return <div>
		<H1>Objectives</H1>
		{map(groupBy(objectives.filter(({completed}) => !completed), 'quest'), (objectives, name) => <div>
			<H2>{name}</H2>
			<ul>{objectives.map(objective => <li key={objective.text}>{objective.text}</li>)}</ul>
		</div>)}

		<CompletedObjectives objectives={objectives} />
	</div>;
});

const ObjectivesControl = observe((props, {dispatch, subscribe}) => {
	const objectives = values(subscribe('objectives', {}));
	return <div>
		<H1>Objectives</H1>

		{map(groupBy(objectives.filter(({completed}) => !completed), 'quest'), (objectives, name) => <div key={name}>
			<H2>{name}</H2>
			<ul>{objectives.map(objective =>
				<li key={objective.id}>
					<button onClick={() => dispatch('objectives', o => Object.assign(o, {
						[objective.id]: Object.assign(o[objective.id], {
							completed: true,
							completedDate: subscribe('date')
						})
					}))}>✔</button>
					{objective.text}
					{objective.completed}
				</li>
			)}</ul>
		</div>)}

		<form onSubmit={ev => dispatch('objectives', o => {
			ev.preventDefault();
			const data = formJson(ev.target);
			const id = shortId();
			ev.target.reset();
			return Object.assign(o, {
				[id]: Object.assign(data, {
					id, completed: false
				}),
			});
		})}>
			<input placeholder='Quest' name='quest' />
			<input placeholder='Objective' name='text' />
			<button>➕</button>
		</form>

		<CompletedObjectives objectives={objectives} />
	</div>;
});

export {
	Objectives as display,
	ObjectivesControl as control
};