import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

//TODO: proper subscriptions
//TODO: joins

export const Cards = new Mongo.Collection('cards');
export const Types = new Mongo.Collection('types');

export const CardLinks = new Mongo.Collection('card-links');

CardLinks.attachSchema(new SimpleSchema({
	_id: {type: String, publish: true},
	symmetrical: {type: Boolean, publish: true},
	name: {type: String, publish: true},
	inverse: {type: String, publish: true},

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

console.log(
	Cards.find()
);
