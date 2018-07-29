import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Forbidden} from 'http-errors';
import {compose, withProps} from 'recompact';

export const withOwnerData = key => withTracker(props => ({
	ownerUser: props[key] ? Meteor.users.findOne(props[key].owner) : null,
}));

export const iAmOwner = key => compose(
	withOwnerData(key),
	withTracker(props => ({
		isOwner: props.ownerUser ? Meteor.userId() === props.ownerUser._id : false,
	}))
);

export const assertAmOwner = key => compose(
	iAmOwner(key),
	withProps(({ready, isOwner, ...props}) => {
		if(ready && isOwner === false) {
			console.log(props);
			throw new Forbidden(`You're not allowed to do that`);
		}
	})
);
