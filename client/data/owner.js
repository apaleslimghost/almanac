import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

const withOwnerData = key => withTracker(props => ({
	ownerUser: Meteor.users.findOne(props[key].owner),
}));

export default withOwnerData;
