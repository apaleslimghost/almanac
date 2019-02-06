import method from './method'
import generateSlug from './generate-slug'

const objectToMongoUpdate = (
	obj,
	top = { $set: {}, $unset: undefined },
	path = []
) =>
	Object.keys(obj).reduce(({ $set, $unset }, key) => {
		const value = obj[key]
		const currentPath = path.concat(key)

		if (value === null) {
			$unset = $unset || {}
			$unset[currentPath.join('.')] = true
		} else if (Object.getPrototypeOf(value) === Object) {
			objectToMongoUpdate(value, { $set, $unset }, currentPath)
		} else {
			$set[currentPath.join('.')] = value
		}

		return { $set, $unset }
	}, top)

export default (collection, validate, historyCollection) => {
	const baseCreate = method(`${collection._name}.create`, function(data) {
		validate.create(data, this.userId)

		data.owner = this.userId
		data.updated = new Date()
		collection.insert(data)

		if (historyCollection) {
			historyCollection.insert({
				verb: 'add',
				date: new Date(),
				owner: this.userId,
				campaignId: data.campaignId,
				data
			})
		}

		return data
	})

	return {
		// HACK: generate slug before passing to method so it's consistent on client and server
		create: data => baseCreate(generateSlug(data)),

		update: method(`${collection._name}.update`, function({ _id }, edit) {
			const data = collection.findOne(_id)
			edit.updated = new Date()

			const update = objectToMongoUpdate(edit)

			if (!update.$unset) {
				delete update.$unset
			}

			validate.edit(data, this.userId, edit)
			collection.update(_id, update)

			if (historyCollection) {
				historyCollection.insert({
					verb: 'edit',
					date: new Date(),
					owner: this.userId,
					campaignId: data.campaignId,
					data: collection.findOne(_id)
				})
			}
		}),

		delete: method(`${collection._name}.delete`, function({ _id }) {
			const data = collection.findOne(_id)
			validate.edit(data, this.userId)
			collection.remove(_id)

			if (historyCollection) {
				historyCollection.insert({
					verb: 'delete',
					date: new Date(),
					owner: this.userId,
					campaignId: data.campaignId,
					data: {}
				})
			}
		})
	}
}
