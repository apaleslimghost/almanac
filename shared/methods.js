import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import generateSlug from './utils/generate-slug';

import {Campaigns} from './collections';

Meteor.methods({
	createCampaign(data) {
		const id = generateSlug(data);
		Roles.addUsersToRoles(this.userId, ['campaign-owner'], id);

		Campaigns.insert(data);
		return id;
	}
});
