import { Forbidden } from 'http-errors'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/quarterto:hooks'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withProps } from 'recompact'
import subscribe from '../utils/subscribe'

export const withOwnerData = key =>
	withTracker(props => ({
		ready: subscribe('users.all'),
		user: props[key] ? Meteor.users.findOne(props[key].owner) : null,
	}))

export const useOwner = item =>
	useTracker(
		() => ({
			ready: subscribe('users.all'),
			owner: Meteor.users.findOne(item.owner),
		}),
		[item],
	)

export const iAmOwner = key =>
	compose(
		withOwnerData(key),
		withTracker(props => ({
			isOwner: props.user ? Meteor.userId() === props.user._id : false,
		})),
	)

export const assertAmOwner = key =>
	compose(
		iAmOwner(key),
		withProps(({ ready, isOwner }) => {
			if (ready && isOwner === false) {
				throw new Forbidden(`You're not allowed to do that`)
			}
		}),
	)

export const useAssertAmOwner = item => {
	const me = useTracker(() => Meteor.userId())
	const { ready, owner } = useOwner(item)

	if (ready && owner._id !== me) {
		throw new Forbidden(`You're not allowed to do that`)
	}
}
