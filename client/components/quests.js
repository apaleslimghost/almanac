import React from 'react';
import formJson from '@quarterto/form-json';
import {H3, H4} from './heading';
import _ from 'lodash';
import pluralize from 'pluralize';
import {Quests, Objectives} from '../../shared/collections';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';

const QuestsList = createContainer(() => ({
	quests: Quests.find().fetch(),
	currentQuest: SyncedSession.get('currentQuest'),
	byQuest: _.groupBy(Objectives.find().fetch(), 'quest'),
}), ({quests, currentQuest, byQuest, onSelectCurrent, onDelete}) =>
	<ul>
		{quests.map(quest =>
			<li key={quest._id}>
				<H3>{quest.name}</H3>
				<H4>{pluralize('objectives', _.size(_.reject(byQuest[quest._id], 'completed')), true)} </H4>
				{onSelectCurrent && <button onClick={() => onSelectCurrent(quest)}>
					{quest._id === currentQuest ? '🔚' : '🔝'}
				</button>}
				{onDelete && <button onClick={() => onDelete(quest)}>❌</button>}
			</li>
		)}
	</ul>
);

const QuestsControl = createContainer(() => ({
	currentQuest: SyncedSession.get('currentQuest'),
	onSelectCurrent(quest) {
		SyncedSession.set('currentQuest', quest._id);
	},
	onDelete(quest) {
		Quests.remove(quest._id);
	},
	onCreate(ev) {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();
		Quests.insert(data);
	}
}),
({currentQuest,onSelectCurrent,
onDelete,
onCreate}) =>
	<div>
		<QuestsList
			onSelectCurrent={onSelectCurrent}
			onDelete={onDelete}
		/>

		<form onSubmit={onCreate}>
			<input placeholder='Quest' name='name' />
			<button>➕</button>
		</form>
	</div>
);

const Empty = () => null;

export {
	QuestsControl as control,
	Empty as display
};
