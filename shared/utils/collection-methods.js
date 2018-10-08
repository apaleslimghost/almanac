import method from './method';
import {Campaigns} from '../collections';
import generateSlug from './generate-slug';
import {Meteor} from 'meteor/meteor';

export default (collection, validate) => {
	const baseCreate = method(`${collection._name}.create`, function(data) {
		validate.create(data, this.userId);

		data.owner = this.userId;
		collection.insert(data);

		return data;
	});

	return {
		// HACK: generate slug before passing to method so it's consistent on client and server
		create: data => baseCreate(
			generateSlug(data)
		),

		update: method(`${collection._name}.update`, function({_id}, $set) {
			const data = collection.findOne(_id);
			validate.edit(data, this.userId, $set);

			collection.update(_id, { $set });
		}),

		delete: method(`${collection._name}.delete`, function({_id}) {
			const data = collection.findOne(_id);
			validate.edit(data, this.userId);
			collection.remove(_id);
		}),
	};
};
