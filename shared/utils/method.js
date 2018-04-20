import {Meteor} from 'meteor/meteor';

module.exports = (name, fn) => {
	Meteor.methods({
		[name]: fn
	});

	return (...args) => Meteor.call(name, ...args);
};
