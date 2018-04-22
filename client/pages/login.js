import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {go} from '../utils/router';
import {Input as BaseInput, Button} from '../visual/primitives';
import {Form, Field} from '../control/form';

const doLogin = ({userOrEmail, password}) => {
	Meteor.loginWithPassword(userOrEmail, password, err => {
		if(err) {
			// TODO error handling
			alert(err.reason);
		} else {
			const {profile} = Meteor.user();
			go(`/${profile.defaultCampaign}`);
		}
	})
};

const Input = props => <Field tag={BaseInput} {...props} />;

export default () => <Form onSubmit={doLogin}>
	<label>
		Username or email
		<Input name='userOrEmail' inputmode='email' placeholder='user@example.com' />
	</label>
	<label>
		Password
		<Input name='password' placeholder='secret' type='password' />
	</label>
	<Button>Log in</Button>
</Form>;
