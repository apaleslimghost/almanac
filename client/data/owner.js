import { Forbidden } from 'http-errors'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/quarterto:hooks'
import subscribe from '../utils/subscribe'

export const useOwner = item =>
	useTracker(
		() => ({
			ready: subscribe('users.all'),
			owner: Meteor.users.findOne(item.owner),
		}),
		[item],
	)

export const useAssertAmOwner = item => {
	const me = useTracker(() => Meteor.userId())
	const { ready, owner } = useOwner(item)

	if (ready && owner._id !== me) {
		throw new Forbidden(`You're not allowed to do that`)
	}
}
