import {Campaigns, Cards} from '../../collections';
import access from '../../access';

// create validation is the same as any doc that belongs to a campaign
export {create} from './campaign-doc';

/*
i can edit a card if:

- i'm the owner or the GM of the campaign
- it's editable by the campaign, and i'm a member of the campaign it's in
- it's editable by the public (???)
 */
export const canEdit = (data, userId, edit) => {
	const campaign = Campaigns.findOne(data.campaignId);

	if(!data.access) {
		// fallback for unmigrated cards, treat them as private
		if(data.owner === userId) {
			return true;
		}
	} else {
		if(
			edit
			&& (
				data.access.view !== edit.access.view
				|| data.access.edit !== edit.access.edit
			)
			&& userId !== data.owner
		) {
			throw new Meteor.Error('card-access-denied', `Only the owner can change the access of a card`);
		}

		if(data.access.edit >= access.PRIVATE) {
			if(data.owner === userId) {
				return true;
			}

			if(campaign && campaign.owner === userId) {
				return true;
			}
		}

		if(data.access.edit >= access.CAMPAIGN) {
			if(campaign && campaign.member.includes(userId)) {
				return true;
			}
		}

		if(data.access.edit === access.PUBLIC) {
			return true;
		}
	}

	return false;
};

export const edit = (data, userId, edit) => {
	if(canEdit(data, userId, edit)) {
		return true;
	}

	throw new Meteor.Error('card-access-denied', `Can't edit that card`);
};
