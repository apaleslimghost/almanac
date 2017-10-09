import React from 'react';
import formJson from '@quarterto/form-json';
import {H1, H2} from './heading';
import Ornamented from './ornamented';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';
import {Cards} from '../../shared/collections'

const getCurrentObjectives = () => {
	const currentQuestId = SyncedSession.get('currentQuest');
	const currentQuest = currentQuestId && Cards.findOne(currentQuestId)
	const objectives = Cards.find({
		type: 'objective',
		_id: {$in: currentQuest.related || {}},
	}).fetch();

	return { currentQuest, objectives };
}

const ObjectivesList = createContainer(
	getCurrentObjectives,
	({currentQuest, objectives, onComplete, onDelete}) =>
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
	return {
		...getCurrentObjectives(),

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
				type: 'objective',
			}, (err, id) =>
				!err && Cards.update(
					SyncedSession.get('currentQuest'),
					{$addToSet: {related: id}}
				)
			);
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
