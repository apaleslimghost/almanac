import {Meteor} from 'meteor/meteor';
import utils from 'meteor/utilities:smart-publications';

const onlyIfOne = a => a.length === 1 ? a[0] : a;

function findJoined(collection, selector = {}) {
	const joins = collection.getJoins();
	const cursor = collection.find(selector);

	return cursor.map(doc => {
		joins.forEach(join => {
			const joinCollection = join.collection();
			const ids = doc[join.localProperty];

			doc[join.localProperty] = onlyIfOne(
				[].concat(ids)
				.map(id =>
					joinCollection
						.findOne(
							id, {
								fields: utils.arrayToFields(join.fields || [])
							}
						)
				)
				.slice(0, join.limit || Infinity)
			);
		});

		return doc;
	});
};

export default findJoined;

if(Meteor.isClient) {
	window.findJoined = findJoined;
}
