import method from './method';

export default collection => ({
	create: method(`${collection._name}.create`, (data) => {
		// TODO validate data against card schema
		// YOLO also check it's a campaign the user can do things in
		const {_id} = generateSlug(data);
		data.owner = this.userId;

		collection.insert(data);
		return data;
	}),

	update: method(`${collection._name}.update`, ({_id}, $set) => {
		// TODO validate update against card schema
		// YOLO also check it's a doc the user can do stuff to
		collection.update(_id, { $set });
	}),

	delete: method(`${collection._name}.delete`, ({_id}) => {
		// YOLO check it's a doc the user can do stuff to
		collection.remove(_id);
	}),
});
