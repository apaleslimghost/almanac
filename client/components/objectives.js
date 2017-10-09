import React from 'react';
import formJson from '@quarterto/form-json';
import {H1, H2} from './heading';
import Ornamented from './ornamented';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';
import {Cards} from '../../shared/collections'

const ObjectivesList = createContainer(() => {
	const currentQuest = SyncedSession.get('currentQuest');
	const objectives = Cards.find({
		type: 'objective',
		quest: currentQuest,
	}).fetch();

	return {
		currentQuest: currentQuest && Cards.findOne(currentQuest),
		objectives
	};
}, ({currentQuest, objectives, onComplete, onDelete}) =>
	currentQuest ? <div>
		<Ornamented ornament='u'>{currentQuest.title}</Ornamented>

		<ul>{objectives.filter(({completed}) => !completed).map(objective =>
			<li key={objective._id}>
				{onComplete && <button onClick={() => onComplete(objective)}>☑️</button>}
				{onDelete && <button onClick={() => onDelete(objective)}>❌</button>}
				{objective.title}
				{objective.completed}
			</li>
		)}</ul>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>
);

const ObjectivesControl = createContainer(() => {
	const currentQuest = SyncedSession.get('currentQuest');
	const objectives = Cards.find({
		type: 'objective',
		quest: currentQuest,
	}).fetch();

	return {
		currentQuest,
		objectives,

		onComplete(objective) {
			Cards.update(objective._id, {
				$set: {
					completed: true,
					completedDate: SyncedSession.get('date'),
				},
			});
		},

		onDelete(objective) {
			Cards.remove(objective._id);
		},

		onCreate(ev) {
			ev.preventDefault();
			const data = formJson(ev.target);
			ev.target.reset();
			Cards.insert({
				...data,
				completed: false,
				quest: currentQuest,
				type: 'objective',
			});
		}
	};
}, ({currentQuest, objectives, onComplete, onDelete, onCreate}) =>
	currentQuest ? <div>
		<ObjectivesList onComplete={onComplete} onDelete={onDelete} />

		<form onSubmit={onCreate}>
			<input placeholder='Objective' name='title' />
			<button>➕</button>
		</form>
	</div> : <Ornamented ornament='u'>No current quest</Ornamented>
);

export {
	ObjectivesList as display,
	ObjectivesControl as control
};
