import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import findJoined from './find-joined';

export const Cards = new Mongo.Collection('cards');

Cards.attachSchema(new SimpleSchema({
	_id: {type: String, publish: true},
	title: {type: String, publish: true},
	text: {type: String, publish: true, optional: true},
}));

export const Types = new Mongo.Collection('types');

Types.attachSchema(new SimpleSchema({
	_id: {type: String, publish: true},
	name: {type: String, publish: true},
	'colour.colour': {type: String, publish: true},
	'colour.shade': {type: Number, publish: true},
	inverse: {
		type: String,
		join: {
			collection: () => Types,
		},
		publish: true,
		optional: true,
	}
}));

export const CardLinks = new Mongo.Collection('card-links');

CardLinks.attachSchema(new SimpleSchema({
	_id: {type: String, publish: true},
	cards: {
		type: [String],
		join: {
			collection: () => Cards,
			fields: ['_id', 'title'],
			limit: 2,
		},
		publish: true,
	},

	type: {
		type: String,
		join: {
			collection: () => Types,
		},
		publish: true,
	},
}));

if(Meteor.isClient) {
	window.collections = exports;
	window.showCollection = (...args) => console.table(findJoined(...args));
	window.showCollections = (selector) =>
		Object.keys(collections)
			.filter(k => collections[k] instanceof Mongo.Collection)
			.forEach(k => {
				console.log(k);
				showCollection(collections[k], selector);
			});
}
