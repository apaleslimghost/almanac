import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { branch, renderNothing, compose } from 'recompact'
import { go } from './router'

export const withUserData = withTracker(() => ({
	user: Meteor.user()
}))

export const logout = ev => {
	ev.preventDefault()
	Meteor.logout()
	go('/')
}

const showLogin = (or = renderNothing) => branch(({ user }) => !user, or)

export default or =>
	compose(
		withUserData,
		showLogin(or)
	)
