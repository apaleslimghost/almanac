import { Meteor } from 'meteor/meteor'
import React from 'react'
import { toast } from 'react-toastify'
import { navigate as go } from 'use-history'
import { LabelledInput, Button } from '../visual/primitives'
import { Form } from '../control/form'
import { Input } from '../visual/form'

export const loggedInRedirect = user => {
	if (user) {
		go(`/${user.profile.defaultCampaign}`)
		return true
	}

	return false
}

export default ({ onLogin = loggedInRedirect }) => {
	function login({ userOrEmail, password }) {
		Meteor.loginWithPassword(userOrEmail, password, err => {
			if (err) {
				toast.error(err.reason)
			} else {
				onLogin(Meteor.user())
			}
		})
	}

	return (
		<Form onSubmit={login}>
			<LabelledInput>
				Username or email
				<Input
					name='userOrEmail'
					inputmode='email'
					placeholder='user@example.com'
				/>
			</LabelledInput>
			<LabelledInput>
				Password
				<Input name='password' placeholder='secret' type='password' />
			</LabelledInput>
			<Button>Log in</Button>
		</Form>
	)
}
