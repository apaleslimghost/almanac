import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { useTracker } from 'meteor/quarterto:hooks'
import { branch, renderNothing, compose } from 'recompact'
import { navigate as go } from 'use-history'

export const withUserData = withTracker(() => ({
	user: Meteor.user(),
}))

export const useUser = () => useTracker(() => Meteor.user())

export const logout = ev => {
	ev.preventDefault()
	Meteor.logout()
	go('/')
}

const showLogin = (or = renderNothing) => branch(({ user }) => !user, or)

export default or =>
	compose(
		withUserData,
		showLogin(or),
	)
