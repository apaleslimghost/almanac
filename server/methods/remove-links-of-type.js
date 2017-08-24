import {Meteor} from 'meteor/meteor';
import {CardLinks} from '../../src/collections';

Meteor.methods({
	'links.removeOfType'({type}) {
		CardLinks.remove({
			$or: [
				{type: type._id},
				{type: type.inverse},
			]
		}, {multi: true});
	},
});
