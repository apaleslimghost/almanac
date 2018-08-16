import React, {Fragment} from 'react';
import {H2} from '../visual/heading';
import {Form} from '../control/form';
import {Input} from '../visual/form';
import {Button, LabelledInput} from '../visual/primitives';
import {createAccount} from '../../shared/methods';
import {go} from '../utils/router';
import CampaignSettings from '../document/campaign-settings';
import {toast} from 'react-toastify';

const onSubmit = async ({username, email, campaign}) => {
	await createAccount({username, email}, campaign);
	toast.success(`We've sent an email to ${email} to verify your address. Check your inbox.`);
	go('/');
};

export default ({title}) => <Form onSubmit={onSubmit}>
	<H2>About you</H2>
	<LabelledInput>
		Username
		<Input required name='username' placeholder='user' />
	</LabelledInput>

	<LabelledInput>
		Email address
		<Input required name='email' type='email' placeholder='user@example.com' />
	</LabelledInput>

	<small>We'll send you an email with a link to verify your address and set your password.</small>

	<H2>About your campaign</H2>
	<CampaignSettings campaign={{title}} name='campaign' tag={Fragment} />

	<Button>Create your account</Button>
</Form>;
