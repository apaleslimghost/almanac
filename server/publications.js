import publish from './utils/publish';
import {Cards, Campaigns, Session, Layout} from '../shared/collections';

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
	campaigns: {
		all: visibleDocs(Campaigns),
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
