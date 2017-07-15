import {Meteor} from 'meteor/meteor';
import {Cards} from '../../src/collections';

Meteor.methods({
	'links.removeOfType'({type}) {
		Cards.update({
			related: {$elemMatch: {type}}
		}, {
			$pull: {
				related: {type}
			}
		}, {multi: true});
	},
});
