import {Types} from '../shared/collections';
import ensureDocs from './ensure-docs';

ensureDocs(Types, {
	quest: {
		name: 'Quest',
		editable: false,
	},

	objective: {
		name: 'Objective',
		editable: false,
	},

	faction: {
		name: 'Faction',
		editable: false,
	},
});
