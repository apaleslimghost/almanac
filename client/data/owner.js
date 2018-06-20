import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

const withOwnerData = key => withTracker(props => ({
	foo: console.log(key, props),
	ownerUser: Meteor.users.findOne(props[key].owner),
}));

export default withOwnerData;
