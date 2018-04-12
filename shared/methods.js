import {Meteor} from 'meteor/meteor';
import generateSlug from './utils/generate-slug';
import {Campaigns, Cards, Session, Layout} from './collections';

//TODO generate methods for all the collections inc. access/campaign access checking

Meteor.methods({
	createCampaign(data) {
		const {_id} = generateSlug(data);
		data.owner = this.userId;

		Campaigns.insert(data);
		return data;
	},

	addRelated(card, related) {
		Cards.update(card._id, {
			$addToSet: {related: related._id},
		});
	},

	removeRelated(card, related) {
		Cards.update(card._id, {
			$pull: {related: related._id},
		});
	},

	updateCard(card, $set) {
		// TODO validate update against card schema
		// YOLO also check it's a card the user can do stuff to
		Cards.update(card._id, { $set });
	},

	createCard(data) {
		// TODO validate data against card schema
		// YOLO also check it's a campaign the user can do things in
		const {_id} = generateSlug(data);
		data.owner = this.userId;

		Cards.insert(data);
		console.log(data);
		return data;
	},

	deleteCard(card) {
		// YOLO check it's a card the user can do stuff to
		Cards.remove(card._id);
	},

	// we swift now boyz
	deleteCardWithRelated(card, {ofType: type}) {
		Cards.remove({
			$or: [
				{_id: card._id},
				{
					type,
					_id: {$in: card.related || []}
				}
			]
		});
	},

	setSession(campaignId, _key, data) {
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
	},

	addLayout(data) {
		console.log(Layout.insert(data));
	},

	updateLayout(layout, $set) {
		Layout.update(layout._id, {$set});
	},

	removeLayout(layout) {
		Layout.remove(_id);
	},
});
