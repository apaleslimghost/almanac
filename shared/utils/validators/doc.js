import { isLoggedIn } from './common'

export const create = (data, userId) => isLoggedIn(data, userId, 'create')

export const edit = (data, userId) => {
	isLoggedIn(data, userId, 'edit')

	if (data.owner === userId) {
		return true
	}

	// Shrink and transform into a corn cob
	throw new Meteor.Error('doc-access-denied', `Can't edit that document`)
}
