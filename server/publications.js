import publish from './utils/publish';
import search from './utils/search';
import {Cards, Campaigns, Session, Layouts} from '../shared/collections';
import {Meteor} from 'meteor/meteor';

Meteor.users._ensureIndex({
	username: 'text',
	'emails.address': 'text',
});

//TODO: public/private

const _visibleDocs = (collection, {userId, campaignIds = []}) => collection.find({
	$or: [
		userId && {owner: userId},
		userId && {member: userId},
		{campaignId: {$in: campaignIds}}
	].filter(a => a)
});

const visibleDocs = collection => ({userId}) => _visibleDocs(collection, {userId});

const visible = collection => ({userId}) => {
	const visibleCampaigns = _visibleDocs(Campaigns, {userId}).fetch();

	return _visibleDocs(collection, {userId, campaignIds: visibleCampaigns.map(c => c._id)});
};

publish({
	users: {
		all: Meteor.users.find({}, {fields: ['username']}),

		search({args}) {
			return Meteor.users.find({
				$text: {$search: args[0]},
			});
		}
	},

	campaigns: {
		all: visibleDocs(Campaigns),
		members({userId}) {
			const visibleCampaigns = _visibleDocs(Campaigns, {userId}).fetch();
			const allCampaignUsers = visibleCampaigns.reduce(
				(users, campaign) => users.concat(campaign.owner).concat(campaign.member),
				[]
			);

			return Meteor.users.find({
				_id: {$in: allCampaignUsers}
			});
		}
	},

	cards: {
		all: visible(Cards),
	},

	session: {
		all: visible(Session),
	},

	layout: {
		all: visible(Layouts),
	},
});
