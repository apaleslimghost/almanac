import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {withTracker} from 'meteor/react-meteor-data';
import {branch, renderComponent, compose} from 'recompose';
import Blaze from 'meteor/gadicc:blaze-react-component';

const withUserData = withTracker(() => ({
	user: Meteor.user(),
}));

const Login = props => <Blaze {...props} template={Template.loginButtons} />;

const showLogin = branch(
	({user}) => !user,
	renderComponent(Login)
);

export default compose(
	withUserData,
	showLogin
);
