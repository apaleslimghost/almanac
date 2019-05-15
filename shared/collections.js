import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const Cards = new Mongo.Collection('cards')
export const CardHistory = new Mongo.Collection('card-history')
export const Campaigns = new Mongo.Collection('campaigns')
export const Session = new Mongo.Collection('session')
export const Layouts = new Mongo.Collection('layout')
export const UnsplashPhotos = new Mongo.Collection('unsplash-photos')

if (Meteor.isServer) {
	Cards._ensureIndex({
		title: 'text',
		text: 'text'
	})
}

if (Meteor.isClient) {
	window.collections = exports

	window.showCollection = (collection, ...args) =>
		console.table(collection.find(...args)) // eslint-disable-line no-console

	window.showCollections = selector =>
		Object.keys(window.collections)
			.filter(k => window.collections[k] instanceof Mongo.Collection)
			.forEach(k => {
				console.log(k) // eslint-disable-line no-console
				window.showCollection(window.collections[k], selector)
			})
}
