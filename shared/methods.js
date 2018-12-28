import {Meteor} from 'meteor/meteor'
import {Random} from 'meteor/random'
import {Accounts} from 'meteor/accounts-base'
import {Campaigns, Cards, Session, Layouts} from './collections'
import method from './utils/method'
import collectionMethods from './utils/collection-methods'
import generateSlug from './utils/generate-slug'
import * as validators from './utils/validators'

export const Campaign = collectionMethods(Campaigns, validators.doc)
export const Card = collectionMethods(Cards, validators.card)
export const Layout = collectionMethods(Layouts, validators.campaignDoc)

const serverToken = Random.secret()

function _addMember(campaign, user, secret, token) {
	const originalCampaign = Campaigns.findOne(campaign._id)

	const amUser = this.userId === user._id
	const amOwner = this.userId === originalCampaign.owner
	const hasSecret = secret === originalCampaign.inviteSecret
	const hasToken = token === serverToken

	// Owner can add anyone, anyone can add themself but only if
	// they have the secret, server can do anything it likes lol
	if (amOwner || ((amUser || hasToken) && hasSecret)) {
		Campaigns.update(campaign._id, {
			$pull: {removedMember: user._id},
			$addToSet: {member: user._id}
		})
	} else
		throw new Meteor.Error(
			'doc-access-denied',
			`Can't add a member to that campaign`
		)
}

export const addMember = method('addMember', _addMember)

export const removeMember = method('removeMember', (campaign, user) => {
	// TODO: verify can do stuff
	Campaigns.update(campaign._id, {
		$pull: {member: user._id},
		$addToSet: {removedMember: user._id}
	})
})

export const addRelated = method('addRelated', (card, related) => {
	Cards.update(card._id, {
		$addToSet: {related: related._id}
	})
})

export const removeRelated = method('removeRelated', (card, related) => {
	Cards.update(card._id, {
		$pull: {related: related._id}
	})
})

export const deleteCardWithRelated = method(
	'deleteCardWithRelated',
	(card, {ofType: type}) => {
		Cards.remove({
			$or: [
				{_id: card._id},
				{
					type,
					_id: {$in: card.related || []}
				}
			]
		})
	}
)

export const setSession = method('setSession', (campaignId, _key, data) => {
	const existing = Session.findOne({
		campaignId,
		_key
	})

	if (campaignId) {
		if (existing) {
			Session.update(existing._id, {$set: {data}})
		} else {
			Session.insert({data, campaignId, _key})
		}
	} else {
		console.trace('No campaign id')
	}
})

export const createAccount = method('createAccount', function(user, campaign) {
	if (!this.isSimulation) {
		// Accounts.createUser only works on the server
		const userId = Accounts.createUser(user)

		// Use Campaigns.insert not Campaign.create to bypass validation lol
		const defaultCampaign = Campaigns.insert(
			generateSlug(
				Object.assign(
					{
						owner: userId,
						member: []
					},
					campaign
				)
			)
		)

		Meteor.users.update(userId, {
			$set: {'profile.defaultCampaign': defaultCampaign}
		})
		Accounts.sendEnrollmentEmail(userId, user.email)
	}
})

export const createAccountAndJoin = method('createAccountAndJoin', function(
	user,
	campaign,
	secret
) {
	if (!secret) {
		throw new Meteor.Error('no-secret', 'tell createAccountAndJoin a secret ;)')
	}

	if (!this.isSimulation) {
		// Accounts.createUser only works on the server
		const userId = Accounts.createUser(user)

		_addMember(campaign, {_id: userId}, secret, serverToken)
		Meteor.users.update(userId, {
			$set: {'profile.defaultCampaign': campaign._id}
		})

		Accounts.sendEnrollmentEmail(userId, user.email)
	}
})

export const errorTest = method('errorTest', () => {
	throw new Meteor.Error('test-error', 'You done goofed')
})
