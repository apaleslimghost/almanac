import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'

const subscribe = (...subs) =>
	subs.map(name => Meteor.subscribe(name)).every(sub => sub.ready())

export default subscribe
export const withSubscribe = (...subs) => withTracker({
	ready: subscribe(...subs)
})