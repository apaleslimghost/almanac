import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {branch, renderComponent, compose} from 'recompose';
import {ComboBox} from 'meteor/universe:accounts-ui';

const withUserData = withTracker(() => ({
	user: Meteor.user(),
}));

const showLogin = branch(
	({user}) => !user,
	renderComponent(ComboBox)
);

export default compose(
	withUserData,
	showLogin
);
