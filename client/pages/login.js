import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {go} from '../utils/router';
import {LabelledInput, Button} from '../visual/primitives';
import {Form} from '../control/form';
import {Input} from '../visual/form';
import {toast} from 'react-toastify';
import {withHandlers} from 'recompact';

export const loggedInRedirect = user => {
	if(user) {
		go(`/${user.profile.defaultCampaign}`);
	} else {
		return false;
	}
}

const withLoginActions = withHandlers({
	login: ({onLogin = loggedInRedirect}) => ({userOrEmail, password}) => {
		Meteor.loginWithPassword(userOrEmail, password, err => {
			if(err) {
				toast.error(err.reason);
			} else {
				onLogin(Meteor.user());
			}
		});
	}
});

export default withLoginActions(({onLogin, login}) => <Form onSubmit={login}>
	<LabelledInput>
		Username or email
		<Input name='userOrEmail' inputmode='email' placeholder='user@example.com' />
	</LabelledInput>
	<LabelledInput>
		Password
		<Input name='password' placeholder='secret' type='password' />
	</LabelledInput>
	<Button>Log in</Button>
</Form>);
