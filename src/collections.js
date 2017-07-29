import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Cards = new Mongo.Collection('cards');

Cards.attachSchema(new SimpleSchema({
	_id: {type: String, publish: true},
	title: {type: String, publish: true},
	text: {type: String, publish: true},
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
