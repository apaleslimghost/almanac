import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

Object.assign(Accounts.urls, {
	enrollAccount(token) {
		return Meteor.absoluteUrl(
			`verify/${token}`
		);
	},
});
