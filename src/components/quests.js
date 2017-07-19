import React from 'react';
import {observe} from '../store';
import formJson from '@quarterto/form-json';
import {H3, H4} from './heading';
import groupBy from 'lodash.groupby';
import values from 'lodash.values';
import size from 'lodash.size';
import reject from 'lodash.reject';
import pluralize from 'pluralize';

const Quests = observe(({onSelectCurrent, onDelete}, {subscribe}) => {
	const quests = subscribe('quests', []);
	const currentQuest = subscribe('currentQuest');
	const byQuest = groupBy(values(subscribe('objectives', {})), 'quest');

	return <ul>
		{quests.map(quest =>
			<li key={quest}>
				<H3>{quest}</H3>
				<H4>{pluralize('objectives', size(reject(byQuest[quest], 'completed')), true)} </H4>
				{onSelectCurrent && <button onClick={() => onSelectCurrent(quest)}>
					{quest === currentQuest ? '🔚' : '🔝'}
				</button>}
				{onDelete && <button onClick={() => onDelete(quest)}>❌</button>}
			</li>
		)}
	</ul>;
});

const QuestsControl = observe((props, {subscribe, dispatch}) => {
	const currentQuest = subscribe('currentQuest');

	return <div>
		<Quests
			onSelectCurrent={
				quest => dispatch('currentQuest', () => currentQuest === quest ? null : quest)
			}
			onDelete={
				quest => dispatch('quests', quests => quests.filter(q => q !== quest))
			}
		/>

		<form onSubmit={ev => dispatch('quests', q => {
			ev.preventDefault();
			const data = formJson(ev.target);

			ev.target.reset();
			return q.concat(data.quest);
		})}>
			<input placeholder='Quest' name='quest' />
			<button>➕</button>
		</form>
	</div>;
});

const Empty = () => null;

export {
	QuestsControl as control,
	Empty as display
};
