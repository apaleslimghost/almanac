import publish from './utils/publish';
import {Cards, Campaigns, Session, Layout} from '../shared/collections';
import {Roles} from 'meteor/alanning:roles';

//TODO: per-card visibility

const visible = (collection, key = 'campaignId') => ({userId}) => collection.find({
	[key]: {
		$in: Roles.getGroupsForUser(userId, ['campaign-owner', 'campaign-member']),
	},
});

publish({
	campaigns: {
		all: visible(Campaigns, '_id'),
	},

	cards: {
		all: visible(Cards),
	},

	session: {
		all: visible(Session),
	},

	layout: {
		all: visible(Layout),
	},
});
