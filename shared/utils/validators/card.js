import {Campaigns} from '../../collections';
import access from '../../access';

// create validation is the same as any doc that belongs to a campaign
export {create} from './campaign-doc';

/*
i can edit a card if:

- i'm the owner
- it's editable by the GM, and i own the campaign it's in
- it's editable by the campaign, and i'm a member of the campaign it's in
- it's editable by the public (???)
 */
export const edit = (data, userId) => {
	const campaign = Campaigns.findOne(data.campaignId);

	if(!data.access) {
		// fallback for unmigrated cards, treat them as private
		if(data.owner === userId) {
			return true;
		}
	} else {
		if(data.access.edit >= access.PRIVATE) {
			if(data.owner === userId) {
				return true;
			}
		}

		if(data.access.edit >= access.AND_GM) {
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

	throw new Meteor.Error('card-access-denied', `Can't edit that card`);
};
