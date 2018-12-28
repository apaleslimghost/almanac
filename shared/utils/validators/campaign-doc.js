import {Campaigns} from '../../collections'
import {isLoggedIn} from './common'
import {edit as canEditDoc} from './doc'

const canAccessCampaignDoc = (data, userId, verb) => {
	const campaign = Campaigns.findOne(data.campaignId)

	if (campaign && campaign.owner === userId) {
		return true
	}

	if (campaign && campaign.member.includes(userId)) {
		return true
	}

	throw new Meteor.Error(
		'campaign-access-denied',
		`Can't ${verb} a document in that campaign`
	)
}

export const create = (data, userId) => {
	isLoggedIn(data, userId, 'create')
	canAccessCampaignDoc(data, userId, 'create')
}

export const edit = (data, userId) => {
	isLoggedIn(data, userId, 'edit')
	canAccessCampaignDoc(data, userId, 'edit')
	canEditDoc(data, userId)
}
