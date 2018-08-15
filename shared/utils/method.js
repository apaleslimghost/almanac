import {Meteor} from 'meteor/meteor';
import {toast} from 'react-toastify';

module.exports = (name, fn) => {
	Meteor.methods({
		[name]: fn
	});

	return (...args) => new Promise((resolve, reject) =>
		Meteor.call(name, ...args, (err, ...results) => {
			if(err) {
				toast.error(err.reason);
				reject(err);
			} else {
				resolve(results.length === 1 ? results[0] : results);
			}
		})
	);
};
