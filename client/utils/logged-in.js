import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {branch, renderComponent, compose} from 'recompact';
import {ComboBox} from 'meteor/universe:accounts-ui';

export const withUserData = withTracker(() => ({
	user: Meteor.user(),
}));

export const logout = ev => {
	ev.preventDefault();
	Meteor.logout();
};

const showLogin = (or = renderComponent(ComboBox)) => branch(
	({user}) => !user,
	or
);

export default or => compose(
	withUserData,
	showLogin(or)
);
