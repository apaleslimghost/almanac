import utils from 'meteor/utilities:smart-publications';

export default function findJoined(collection, selector) {
	const joins = collection.getJoins();
	const cursor = collection.find(selector);

	return cursor.map(document => {
		joins.forEach(join => {
			const joinCollection = join.collection();
			const ids = document[join.localProperty];

			document[join.localProperty] = Array.isArray(ids)
				? joinCollection.find(
					{_id: {$in: ids}},
					{limit: join.limit, fields: utils.arrayToFields(join.fields || [])}
				).fetch()
				: joinCollection.findOne(ids);
		});

		return document;
	});
};
