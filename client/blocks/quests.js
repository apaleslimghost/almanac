import React from 'react';
import formJson from '@quarterto/form-json';
import {H3, H4} from '../components/heading';
import _ from 'lodash';
import pluralize from 'pluralize';
import {Cards} from '../../shared/collections';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';

const QuestsList = createContainer(() => ({
	quests: Cards.find({type: 'quest'}).fetch(),
	currentQuest: SyncedSession.get('currentQuest'),
	byQuest: _.groupBy(Cards.find({type: 'objective'}).fetch(), 'quest'),
}), ({quests, currentQuest, byQuest, onSelectCurrent, onDelete}) =>
	<ul>
		{quests.map(quest =>
			<li key={quest._id}>
				<H3>{quest.title}</H3>
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
		Cards.remove(quest._id);
	},
	onCreate(ev) {
		ev.preventDefault();
		const data = formJson(ev.target);
		data.type = 'quest';
		ev.target.reset();
		Cards.insert(data);
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
			<input placeholder='Quest' name='title' />
			<button>➕</button>
		</form>
	</div>
);

const Empty = () => null;

export {
	QuestsControl as control,
	Empty as display
};
