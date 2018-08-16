import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {go} from '../utils/router';
import {LabelledInput, Button} from '../visual/primitives';
import {Form} from '../control/form';
import {Input} from '../visual/form';
import {toast} from 'react-toastify';

export const loggedInRedirect = () => {
	const user = Meteor.user();

	if(user) {
		go(`/${user.profile.defaultCampaign}`);
	} else {
		return false;
	}
}

const doLogin = ({userOrEmail, password}) => {
	Meteor.loginWithPassword(userOrEmail, password, err => {
		if(err) {
			toast.error(err.reason);
		} else {
			loggedInRedirect();
		}
	});
};

export default () => <Form onSubmit={doLogin}>
	<LabelledInput>
		Username or email
		<Input name='userOrEmail' inputmode='email' placeholder='user@example.com' />
	</LabelledInput>
	<LabelledInput>
		Password
		<Input name='password' placeholder='secret' type='password' />
	</LabelledInput>
	<Button>Log in</Button>
</Form>;
