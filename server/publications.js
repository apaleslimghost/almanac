import publish from './utils/publish';
import search from './utils/search';
import {Cards, Campaigns, Session, Layouts} from '../shared/collections';
import {Meteor} from 'meteor/meteor';
import access from '../shared/access';

const ownedCampaigns = ({userId}) => Campaigns.find({
	owner: userId,
});

const memberCampaigns = ({userId}) => Campaigns.find({
	$or: [
		{owner: userId},
		{member: userId},
	]
});

const visibleDocs = collection => ({userId}) => {
	const campaignIds = memberCampaigns({userId}).map(c => c._id);

	return collection.find({
		$or: [
			{owner: userId},
			{campaignId: {$in: campaignIds}},
		]
	});
};

/*
i can see a card if:

- i'm the owner
- it's visible to the GM, and it's in a campaign i own
- it's visible to the campaign, it's in a campaign i'm a member of
- it's public
 */

const visibleCards = ({userId}) => {
	const ownedCampaignIds = ownedCampaigns({userId}).map(c => c._id);
	const memberCampaignIds = memberCampaigns({userId}).map(c => c._id);

	return Cards.find({
		$or: [
			{owner: userId},
			{campaignId: {$in: ownedCampaignIds}, access: {view: access.AND_GM}},
			{campaignId: {$in: memberCampaignIds}, access: {view: access.CAMPAIGN}},
			{access: {view: access.PUBLIC}},
		]
	});
};

publish({
	users: {
		all: () => Meteor.users.find({}, {fields: {username: 1}}),
	},

	campaigns: {
		all: memberCampaigns,

		join({args: [{campaignId, secret}]}) {
			return Campaigns.find({
				_id: campaignId,
				inviteSecret: secret,
			});
		},

		members({userId}) {
			const campaigns = memberCampaigns({userId}).fetch();

			const allCampaignUsers = campaigns.reduce(
				(users, campaign) => users
					.concat(campaign.owner)
					.concat(campaign.member)
					.concat(campaign.removedMember || []),
				[]
			);

			return Meteor.users.find({
				_id: {$in: allCampaignUsers}
			});
		},
	},

	cards: {
		all: visibleCards,
	},

	session: {
		all: visibleDocs(Session),
	},

	layout: {
		all: visibleDocs(Layouts),
	},
});
