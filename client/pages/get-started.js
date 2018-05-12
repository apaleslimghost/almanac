import React from 'react';
import {H2} from '../visual/heading';
import {Form, Field, FormFieldData} from '../control/form';
import {Input as BaseInput, Button} from '../visual/primitives';
import {createAccount} from '../../shared/methods';
import {go} from '../utils/router';
import CampaignSettings from '../document/campaign-settings';

const Input = props => <Field tag={BaseInput} {...props} />;

const onSubmit = ({username, email, campaign}) => {
	createAccount({username, email}, campaign);
	// TODO success messaging
	go('/');
};

export default ({title}) => <Form onSubmit={onSubmit}>
	<H2>About you</H2>
	<label>
		Username
		<Input required name='username' placeholder='user' />
	</label>

	<label>
		Email address
		<Input required name='email' type='email' placeholder='user@example.com' />
	</label>

	<small>We'll send you an email with a link to verify your address and set your password.</small>

	<H2>About your campaign</H2>
	<CampaignSettings campaign={{title}} name='campaign' tag='div' />

	<Button>Create your account</Button>
</Form>;
