import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import _ from 'lodash'

const subscribe = (...subs) =>
	subs
		.map(sub => Meteor.subscribe(...([].concat(sub))))
		.every(sub => sub.ready())

export default subscribe
export const withSubscribe = (...subs) => withTracker({
	ready: subscribe(...subs)
})