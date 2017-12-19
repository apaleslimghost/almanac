import {Types} from '../shared/collections';
import ensureDocs from './ensure-docs';

ensureDocs(Types, {
	quest: {
		name: 'Quest',
	},

	objective: {
		name: 'Objective',
	},

	faction: {
		name: 'Faction',
	},
});
