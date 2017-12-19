function ensureDoc(collection, id, doc) {
	const found = !!collection.findOne(id);
	console.log(`Ensuring doc ${id} in collection ${collection._name}`);
	const {numberAffected} = collection.upsert(id, doc);
	console.log(found
		? ' ↳ ⎙ updated'
		: ' ↳ ⎆ inserted'
	);
	console.log();
}

const ensureDocs = (collection, docs) =>
	Object.keys(docs)
		.forEach(id => ensureDoc(collection, id, docs[id]));

export default ensureDocs;
