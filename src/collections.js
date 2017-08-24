import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Cards = new Mongo.Collection('cards');

if(Meteor.isClient) {
	window.collections = exports;
	window.showCollection = (collection, ...args) => console.table(collection.find(...args));
	window.showCollections = (selector) =>
		Object.keys(collections)
			.filter(k => collections[k] instanceof Mongo.Collection)
			.forEach(k => {
				console.log(k);
				showCollection(collections[k], selector);
			});
}
