import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import _ from 'lodash'
import { toast } from 'react-toastify'

const subscribe = (...subs) =>
	subs
		.map(sub =>
			Meteor.subscribe(...[].concat(sub), {
				onStop(error) {
					if (error) {
						toast.error(error.reason)
					}
				}
			})
		)
		.every(sub => sub.ready())

export default subscribe
export const withSubscribe = (...subs) =>
	withTracker({
		ready: subscribe(...subs)
	})
