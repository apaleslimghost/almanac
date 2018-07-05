import Fuse from 'fuse.js';
import { Tracker } from 'meteor/tracker'

export default (collection, options) => {
	const fuse = new Fuse(collection.find().fetch(), options);

	return term => fuse.search(term);
};
