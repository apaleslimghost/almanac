import { Meteor } from 'meteor/meteor'

const publish = (publications, path = []) =>
	Object.keys(publications).forEach(key => {
		const nextPath = path.concat(key)
		if (typeof publications[key] === 'function') {
			Meteor.publish(nextPath.join('.'), function(...args) {
				return publications[key]({
					userId: this.userId,
					added: this.added.bind(this),
					changed: this.changed.bind(this),
					removed: this.removed.bind(this),
					ready: this.ready.bind(this),
					args,
				})
			})
		} else {
			publish(publications[key], nextPath)
		}
	})

export default publish
