import React from 'react';
import groupBy from 'lodash.groupby';
import values from 'lodash.values';
import map from 'lodash.map';
import orderBy from 'lodash.orderby';
import formJson from '@quarterto/form-json';
import shortId from '@quarterto/short-id';
import {observe} from '../store';
import {H1, H2} from './heading';
import Ornamented from './ornamented';

const Objectives = observe(({onComplete, onDelete}, {subscribe}) => {
	const objectives = values(subscribe('objectives', {}));
	const currentQuest = subscribe('currentQuest');

	const byQuest = groupBy(objectives, 'quest');
	const questObjectives = byQuest[currentQuest] || [];

	return currentQuest ? <div>
		<Ornamented ornament='u'>{currentQuest}</Ornamented>

		<ul>{questObjectives.filter(({completed}) => !completed).map(objective =>
			<li key={objective.id}>
				{onComplete && <button onClick={() => onComplete(objective)}>☑️</button>}
				{onDelete && <button onClick={() => onDelete(objective)}>❌</button>}
				{objective.text}
				{objective.completed}
			</li>
		)}</ul>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>;
});

const ObjectivesControl = observe((props, {dispatch, subscribe}) => {
	const objectives = values(subscribe('objectives', {}));
	const currentQuest = subscribe('currentQuest');
	const byQuest = groupBy(objectives, 'quest');

	return currentQuest ? <div>
		<Objectives onComplete={objective => dispatch('objectives', o => Object.assign(o, {
			[objective.id]: Object.assign(o[objective.id], {
				completed: true,
				completedDate: subscribe('date')
			})
		}))} onDelete={objective => dispatch('objectives', o => {
			delete o[objective.id];
			return o;
		})} />

		<form onSubmit={ev => dispatch('objectives', o => {
			ev.preventDefault();
			const data = formJson(ev.target);
			const id = shortId();
			ev.target.reset();
			return Object.assign(o, {
				[id]: Object.assign(data, {
					id, completed: false, quest: currentQuest
				}),
			});
		})}>
			<input placeholder='Objective' name='text' />
			<button>➕</button>
		</form>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>;
});

export {
	Objectives as display,
	ObjectivesControl as control
};
