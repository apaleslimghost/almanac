import { Meteor } from 'meteor/meteor'
import { useSubscription, useFindOne, useTracker } from '../utils/hooks'

export const useOwner = item => {
	const ready = useSubscription('users.all')
	const owner = useFindOne(Meteor.users, item && item.owner, [ready, item])
	return { ready, owner }
}

export const useAmOwner = item => {
	const me = useTracker(() => Meteor.userId())
	const { ready, owner } = useOwner(item)

	return { ready, amOwner: owner && owner._id === me }
}

export const useAssertAmOwner = item => {
	const { ready, amOwner } = useAmOwner(item)
	if (item && ready && !amOwner) {
		throw new Error(`You're not allowed to do that`)
	}
}
