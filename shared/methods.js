import {Meteor} from 'meteor/meteor';
import generateSlug from './utils/generate-slug';
import {Campaigns, Cards, Session, Layout} from './collections';
import method from './utils/method';

//TODO generate methods for all the collections inc. access/campaign access checking

export const createCampaign = method('createCampaign', function(data) {
	const {_id} = generateSlug(data);
	data.owner = this.userId;

	Campaigns.insert(data);
	return data;
});

export const addRelated = method('addRelated', function(card, related) {
	Cards.update(card._id, {
		$addToSet: {related: related._id},
	});
});

export const removeRelated = method('removeRelated', function(card, related) {
	Cards.update(card._id, {
		$pull: {related: related._id},
	});
});

export const updateCard = method('updateCard', function(card, $set) {
	// TODO validate update against card schema
	// YOLO also check it's a card the user can do stuff to
	Cards.update(card._id, { $set });
});

export const createCard = method('createCard', function(data) {
	// TODO validate data against card schema
	// YOLO also check it's a campaign the user can do things in
	const {_id} = generateSlug(data);
	data.owner = this.userId;

	Cards.insert(data);
	return data;
});

export const deleteCard = method('deleteCard', function(card) {
	// YOLO check it's a card the user can do stuff to
	Cards.remove(card._id);
});

// we swift now boyz
export const deleteCardWithRelated = method('deleteCardWithRelated', function(card, {ofType: type}) {
	Cards.remove({
		$or: [
			{_id: card._id},
			{
				type,
				_id: {$in: card.related || []}
			}
		]
	});
});

export const setSession = method('setSession', function(campaignId, _key, data) {
	const existing = Session.findOne({
		campaignId,
		_key
	});

	if(campaignId) {
		if(existing) {
			Session.update(existing._id, {$set: {data}});
		} else {
			Session.insert({data, campaignId, _key});
		}
	} else {
		console.trace('No campaign id');
	}
});

export const addLayout = method('addLayout', function(data) {
	Layout.insert(data);
});

export const updateLayout = method('updateLayout', function(layout, $set) {
	Layout.update(layout._id, {$set});
});

export const removeLayout = method('removeLayout', function(layout) {
	Layout.remove(layout._id);
});
