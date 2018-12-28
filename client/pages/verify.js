import { Accounts } from 'meteor/accounts-base'
import React from 'react'
import { toast } from 'react-toastify'
import { LabelledInput, Button } from '../visual/primitives'
import { Form } from '../control/form'
import { Input } from '../visual/form'
import { go } from '../utils/router'

const resetPassword = token => ({ password }) =>
	Accounts.resetPassword(token, password, (err, ...r) => {
		if (err) {
			toast.error(err.reason)
		} else {
			Accounts._enableAutoLogin()
			const { profile } = Meteor.user()
			go(`/${profile.defaultCampaign}`)
		}
	})

export default ({ token }) => (
	<Form onSubmit={resetPassword(token)}>
		<LabelledInput>
			Password
			<Input
				placeholder='correct horse battery staple'
				type='password'
				name='password'
			/>
		</LabelledInput>

		<Button>Set password & create account</Button>
	</Form>
)
