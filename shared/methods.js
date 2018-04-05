import {Meteor} from 'meteor/meteor';
import generateSlug from './utils/generate-slug';
import {Campaigns} from './collections';

Meteor.methods({
	createCampaign(data) {
		const {_id} = generateSlug(data);
		data.owner = this.userId;

		Campaigns.insert(data);
		return _id;
	}
});
