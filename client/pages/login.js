import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {go} from '../utils/router';
import {LabelledInput, Button} from '../visual/primitives';
import {Form} from '../control/form';
import {Input} from '../visual/form';

const doLogin = ({userOrEmail, password}) => {
	Meteor.loginWithPassword(userOrEmail, password, err => {
		if(err) {
			// TODO error handling
			alert(err.reason);
		} else {
			const {profile} = Meteor.user();
			go(`/${profile.defaultCampaign}`);
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
