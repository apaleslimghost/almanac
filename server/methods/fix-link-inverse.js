import {Meteor} from 'meteor/meteor';
import {Types} from '../../src/collections';

Meteor.methods({
	'links.fixInverse'({type}) {
		// all of this is filthy but i'd rather do this than have a collection of
		// LinkLinks or TypeLinks or whatever

		// nuke inverses involving this type or the new inverse from orbit
		// (it's the only way to be sure)
		Types.update(
			{$or: [
				{inverse: type.inverse},
				{_id: type.inverse},
				{inverse: type._id},
			]},
			{$unset: {inverse: ''}},
			{multi: true}
		);

		if(type.inverse !== type._id) {
			// add the reciprocal inverse
			Types.update(type.inverse, {$set: {inverse: type._id}});
		}
	},

	'links.nukeInversesDevOnly'() {
		Types.update({inverse: {$exists: true}}, {$unset: {inverse: ''}}, {multi: true});
	},
});
