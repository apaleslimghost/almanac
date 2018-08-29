import React, {Fragment} from 'react';
import {H2} from '../visual/heading';
import {Form} from '../control/form';
import {Input} from '../visual/form';
import {Button, LabelledInput} from '../visual/primitives';
import {createAccount} from '../../../shared/imports/methods';
import {go} from '../utils/router';
import CampaignSettings from '../document/campaign-settings';
import {toast} from 'react-toastify';
import {withHandlers} from 'recompact';

export const withAccountActions = withHandlers({
	createAccount: ({createAccountMethod = createAccount}) => async ({username, email, campaign}) => {
		await createAccountMethod({username, email}, campaign);
		toast.success(`We've sent an email to ${email} to verify your address. Check your inbox.`);
		go('/');
	},
});

const SignupFields = ({}) => <>
	<LabelledInput>
		Username
		<Input required name='username' placeholder='user' />
	</LabelledInput>

	<LabelledInput>
		Email address
		<Input required name='email' type='email' placeholder='user@example.com' />
	</LabelledInput>

	<small>We'll send you an email with a link to verify your address and set your password.</small>
</>;

export const SignupForm = withAccountActions(({createAccount}) => <Form onSubmit={createAccount}>
	<SignupFields />

	<Button>Create your account</Button>
</Form>);


export default withAccountActions(({title, createAccount}) => <Form onSubmit={createAccount}>
	<H2>About you</H2>

	<SignupFields />

	<H2>About your campaign</H2>
	<CampaignSettings campaign={{title}} name='campaign' tag={Fragment} />

	<Button>Create your account</Button>
</Form>);
