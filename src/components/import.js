import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import * as collections from '../collections';
import _ from 'lodash';
import shortId from '@quarterto/short-id';
import SyncedSession, {collection} from 'meteor/quarterto:synced-session';

collections.SyncedSession = collection;
const {Quests, Objectives} = collections;

const Import = createContainer(() => ({
	legacyImport() {
		fetch('https://jsonbin.org/quarterto/almanac')
			.then(r => r.json())
			.then(data => {
				const questsById = _.keyBy(data.quests, quest => {
					const _id = shortId();
					Quests.insert({name: quest, _id});
					return _id;
				});

				const idsByQuest = _.invert(questsById);

				_.map(data.objectives, objective => {
					delete objective.id;

					Objectives.insert(Object.assign(objective, {
						quest: idsByQuest[objective.quest]
					}));
				});

				SyncedSession.set('weather', data.weather);
				SyncedSession.set('date', data.date);
				SyncedSession.set('currentQuest', idsByQuest[data.currentQuest]);
			});
	},

	onSubmit(ev) {
		const {file} = ev.target;
		ev.preventDefault();
		if(!file.files.length) return;

		const reader = new FileReader;
		reader.addEventListener('load', () => {
			const data = JSON.parse(reader.result);
			_.map(data, (docs, collection) => {
				docs.forEach(doc => {
					collections[collection].insert(doc);
				});
			});
		});

		reader.readAsText(file.files[0]);
	},

	doExport() {
		const data = _.mapValues(collections, collection => collection.find().fetch());
		const jsonData = btoa(
			JSON.stringify(data)
		);

		const a = document.createElement('a');
		a.download = `almanac-${Date.now()}.json`;
		a.href = `data:application/json;base64,${jsonData}`;
		a.click();
	}
}), ({onSubmit, legacyImport, doExport}) => <form onSubmit={onSubmit}>
	<input type='file' name='file' accept='application/json' />
	<input type='submit' value='Import' />
	<input type='button' value='Import legacy data from JSONBin' onClick={legacyImport} />
	<input type='button' value='Export' onClick={doExport} />
</form>)

const Empty = () => null;

export {
	Import as control,
	Empty as display
};
