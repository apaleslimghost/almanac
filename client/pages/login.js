import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {navigate} from 'meteor/quarterto:reactive-history';
import {Input as BaseInput, Button} from '../visual/primitives';
import {Form, Field} from '../control/form';

const doLogin = ({userOrEmail, password}) => {
	Meteor.loginWithPassword(userOrEmail, password, err => {
		if(err) {
			alert(err.reason);
		} else {
			navigate('/');
		}
	})
};

const Input = props => <Field tag={BaseInput} {...props} />;

export default () => <Form onSubmit={doLogin}>
	<label>
		Username or email
		<Input name='userOrEmail' placeholder='user@example.com' />
	</label>
	<label>
		Password
		<Input name='password' placeholder='secret' type='password' />
	</label>
	<Button>Log in</Button>
</Form>;
