import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {branch, renderNothing, compose} from 'recompact';

export const withUserData = withTracker(() => ({
	user: Meteor.user(),
}));

export const logout = ev => {
	ev.preventDefault();
	Meteor.logout();
};

const showLogin = (or = renderNothing) => branch(
	({user}) => !user,
	or
);

export default or => compose(
	withUserData,
	showLogin(or)
);
