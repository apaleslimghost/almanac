import { Meteor } from 'meteor/meteor'
import { toast } from 'react-toastify'

const subscribe = (...subs) =>
	subs
		.map(sub =>
			Meteor.subscribe(...[].concat(sub), {
				onStop(error) {
					if (error) {
						toast.error(error.reason)
					}
				},
			}),
		)
		.every(sub => sub.ready())

export default subscribe
