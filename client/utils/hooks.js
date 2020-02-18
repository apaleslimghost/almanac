import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'

export { useTracker }

export const useSubscription = (subscription, ...args) =>
	useTracker(
		() => subscription && Meteor.subscribe(subscription, ...args).ready(),
		[subscription, ...args],
	)

export const useCursor = (cursor, deps = []) =>
	useTracker(() => cursor && cursor.fetch(), deps)

export const useFindOne = (collection, query, deps = []) =>
	useTracker(() => collection.findOne(query), deps)
