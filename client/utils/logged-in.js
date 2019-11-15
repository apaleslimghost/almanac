import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/quarterto:hooks'
import { navigate as go } from 'use-history'

export const useUser = () => useTracker(() => Meteor.user())

export const logout = ev => {
	ev.preventDefault()
	Meteor.logout()
	go('/')
}
