import Fuse from 'fuse.js';
import { Tracker } from 'meteor/tracker'

export default (collection, options) => {
	const fuse = new Fuse([], options);

	Tracker.autorun(() => fuse.setCollection(
		collection.find().fetch()
	));

	return term => fuse.search(term);
};
