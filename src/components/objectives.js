import React from 'react';
import groupBy from 'lodash.groupby';
import formJson from '@quarterto/form-json';
import {H1, H2} from './heading';
import Ornamented from './ornamented';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';
import {Objectives, Quests} from '../collections'

const ObjectivesList = createContainer(() => {
	const currentQuest = SyncedSession.get('currentQuest');
	const objectives = Objectives.find({
		quest: currentQuest,
	}).fetch();

	return {
		currentQuest: currentQuest && Quests.findOne(currentQuest),
		objectives
	};
}, ({currentQuest, objectives, onComplete, onDelete}) =>
	currentQuest ? <div>
		<Ornamented ornament='u'>{currentQuest.name}</Ornamented>

		<ul>{objectives.filter(({completed}) => !completed).map(objective =>
			<li key={objective._id}>
				{onComplete && <button onClick={() => onComplete(objective)}>☑️</button>}
				{onDelete && <button onClick={() => onDelete(objective)}>❌</button>}
				{objective.text}
				{objective.completed}
			</li>
		)}</ul>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>
);

const ObjectivesControl = createContainer(() => {
	const currentQuest = SyncedSession.get('currentQuest');
	const objectives = Objectives.find({
		quest: currentQuest,
	}).fetch();

	return {
		currentQuest,
		objectives,

		onComplete(objective) {
			Objectives.update(objective._id, {
				$set: {
					completed: true,
					completedDate: SyncedSession.get('date'),
				},
			});
		},

		onDelete(objective) {
			Objectives.remove(objective._id);
		},

		onCreate(ev) {
			ev.preventDefault();
			const data = formJson(ev.target);
			ev.target.reset();
			Objectives.insert({
				...data,
				completed: false,
				quest: currentQuest,
			});
		}
	};
}, ({currentQuest, objectives, onComplete, onDelete, onCreate}) =>
	currentQuest ? <div>
		<ObjectivesList onComplete={onComplete} onDelete={onDelete} />

		<form onSubmit={onCreate}>
			<input placeholder='Objective' name='text' />
			<button>➕</button>
		</form>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>
);

export {
	ObjectivesList as display,
	ObjectivesControl as control
};
