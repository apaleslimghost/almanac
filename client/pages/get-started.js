import React, { Fragment } from 'react'
import { toast } from 'react-toastify'
import { withHandlers } from 'recompact'
import { H2 } from '../visual/heading'
import { Form } from '../control/form'
import { Input } from '../visual/form'
import { Button, LabelledInput } from '../visual/primitives'
import { createAccount } from '../../shared/methods'
import { go } from '../utils/router'
import CampaignSettings from '../document/campaign-settings'

export const withAccountActions = withHandlers({
	submitAccount: ({ createAccountMethod = createAccount }) => async ({
		username,
		email,
		campaign,
	}) => {
		await createAccountMethod({ username, email }, campaign)
		toast.success(
			`We've sent an email to ${email} to verify your address. Check your inbox.`,
		)
		go('/')
	},
})

const SignupFields = () => (
	<>
		<LabelledInput>
			Username
			<Input required name='username' placeholder='user' />
		</LabelledInput>

		<LabelledInput>
			Email address
			<Input
				required
				name='email'
				type='email'
				placeholder='user@example.com'
			/>
		</LabelledInput>

		<small>
			We&apos;ll send you an email with a link to verify your address and set
			your password.
		</small>
	</>
)

export const SignupForm = withAccountActions(({ submitAccount }) => (
	<Form onSubmit={submitAccount}>
		<SignupFields />

		<Button>Create your account</Button>
	</Form>
))

export default withAccountActions(({ title, submitAccount }) => (
	<Form onSubmit={submitAccount}>
		<H2>About you</H2>

		<SignupFields />

		<H2>About your campaign</H2>
		<CampaignSettings campaign={{ title }} name='campaign' tag={Fragment} />

		<Button>Create your account</Button>
	</Form>
))
