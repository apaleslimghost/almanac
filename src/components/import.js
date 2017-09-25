import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Objectives, Quests} from '../collections';
import keyBy from 'lodash.keyby';
import map from 'lodash.map';
import invert from 'lodash.invert';
import shortId from '@quarterto/short-id';
import SyncedSession from 'meteor/quarterto:synced-session';

const Import = createContainer(() => ({
	onSubmit(ev) {
		const {file} = ev.target;
		ev.preventDefault();
		if(!file.files.length) return;

		const reader = new FileReader;
		reader.addEventListener('load', () => {
			const data = JSON.parse(reader.result);

			const questsById = keyBy(data.quests, quest => {
				const _id = shortId();
				Quests.insert({name: quest, _id});
				return _id;
			});

			const idsByQuest = invert(questsById);

			map(data.objectives, objective => {
				delete objective.id;

				Objectives.insert(Object.assign(objective, {
					quest: idsByQuest[objective.quest]
				}));
			});

			SyncedSession.set('weather', data.weather);
			SyncedSession.set('date', data.date);
			SyncedSession.set('currentQuest', idsByQuest[data.currentQuest]);
		});

		reader.readAsText(file.files[0]);
	}
}), ({onSubmit}) => <form onSubmit={onSubmit}>
	<input type='file' name='file' accept='application/json' />
	<input type='submit' />
</form>)

const Empty = () => null;

export {
	Import as control,
	Empty as display
};
