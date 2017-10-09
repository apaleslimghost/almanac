import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {collection} from 'meteor/quarterto:synced-session';

export const Cards = new Mongo.Collection('cards');
export const SyncedSession = collection;

//TODO nest quests instead of quests → objectives
export const Layout = new Mongo.Collection('layout');
export const Factions = new Mongo.Collection('factions');

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
