import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {collection} from 'meteor/quarterto:synced-session';

export const Cards = new Mongo.Collection('cards');
export const Types = new Mongo.Collection('types');
export const Campaigns = new Mongo.Collection('campaigns');
export const SyncedSession = collection;

export const Layout = new Mongo.Collection('layout');

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
