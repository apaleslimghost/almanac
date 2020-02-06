import { Forbidden } from 'http-errors'
import { Meteor } from 'meteor/meteor'
import { useSubscription, useFindOne, useTracker } from 'meteor/quarterto:hooks'

export const useOwner = item => {
	const ready = useSubscription('users.all')
	const owner = useFindOne(Meteor.users, item && item.owner, [ready, item])
	return { ready, owner }
}

export const useAmOwner = item => {
	const me = useTracker(() => Meteor.userId())
	const { ready, owner } = useOwner(item)

	return ready && owner && owner._id === me
}

export const useAssertAmOwner = item => {
	if (!useAmOwner(item) && item) {
		throw new Forbidden(`You're not allowed to do that`)
	}
}
