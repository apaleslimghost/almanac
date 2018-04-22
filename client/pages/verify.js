import React from 'react';
import {Input as BaseInput, Button} from '../visual/primitives';
import {Field, Form} from '../control/form';
import {Accounts} from 'meteor/accounts-base';
import {go} from '../utils/router';

const Input = props => <Field tag={BaseInput} {...props} />;

const resetPassword = token => ({password}) => Accounts.resetPassword(token, password, (err, ...r) => {
	if(err) {
		alert(err.reason);
	} else {
		Accounts._enableAutoLogin();
		const {profile} = Meteor.user();
		go(`/${profile.defaultCampaign}`);
	}
});

export default ({token}) => <Form onSubmit={resetPassword(token)}>
	<label>
		Password
		<Input placeholder='correct horse battery staple' type='password' name='password' />
	</label>

	<Button>Set password & create account</Button>
</Form>
