import method from './method';
import {Campaigns} from '../collections';
import generateSlug from './generate-slug';
import {Meteor} from 'meteor/meteor';

/*
okay kara what are the dimensions

user relative to campaign of thing
user relative to thing
visibility of thing
action

visibility possibilities:
public, campaign, me & gm, only me

user relative to campaign of thing:
gm, member, not a member

user relative to thing:
owner, not owner

action:
create, update, delete

72 permutations kara :/
*/

const validateAccess = (collection, data, userId, verb) => {
	if(!userId) {
		throw new Meteor.Error('not-logged-in', `Can't ${verb} something if you're not logged in`);
	}

	if(collection !== Campaigns) { // hmmm
		if(!data.campaignId) throw new Meteor.Error('campaign-missing', 'No campaign ID in data');

		const campaign = Campaigns.findOne(data.campaignId);
		if(!campaign || (campaign.owner !== userId && !campaign.member.includes(userId))) {
			throw new Meteor.Error('campaign-access-denied', `Can't ${verb} a document in that campaign`);
		}
	}

	if(verb !== 'create') {
		const originalData = collection.findOne(data._id);
		if(!originalData) {
			throw new Meteor.Error('doc-doesnt-exist', `Can't ${verb} a document that doesn't exist`);
		}

		if(originalData.owner !== userId) {
			throw new Meteor.Error('doc-access-denied', `Can't ${verb} that document`);
		}
	}
};

export default collection => ({
	create: method(`${collection._name}.create`, function(data) {
		// TODO validate data against card schema
		const {_id} = generateSlug(data);
		validateAccess(collection, data, this.userId, 'create');

		data.owner = userId;
		collection.insert(data);

		return data;
	}),

	update: method(`${collection._name}.update`, function({_id}, $set) {
		// TODO validate update against card schema
		const data = collection.findOne(_id);
		validateAccess(collection, data, this.userId, 'update');

		collection.update(_id, { $set });
	}),

	delete: method(`${collection._name}.delete`, function({_id}) {
		const data = collection.findOne(_id);
		validateAccess(collection, data, this.userId, 'delete');
		collection.remove(_id);
	}),
});
