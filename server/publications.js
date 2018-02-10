import publish from './publish';
import {Cards, Campaigns, Session, Layout} from '../shared/collections';

const visible = collection => ({userId}) => collection.find({
	$or: [
		{owner: userId},
		{members: userId},
	],
});

publish({
	cards: {
		all: visible(Cards),
	},

	campaigns: {
		all: visible(Campaigns),
	},

	session: {
		all: visible(Session),
	},

	layout: {
		all: visible(Layout),
	},
});
