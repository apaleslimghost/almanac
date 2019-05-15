import { Meteor } from 'meteor/meteor'
import React from 'react'
import { toast } from 'react-toastify'
import { withHandlers } from 'recompact'
import { go } from '../utils/router'
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

const withLoginActions = withHandlers({
	login: ({ onLogin = loggedInRedirect }) => ({ userOrEmail, password }) => {
		Meteor.loginWithPassword(userOrEmail, password, err => {
			if (err) {
				toast.error(err.reason)
			} else {
				onLogin(Meteor.user())
			}
		})
	}
})

export default withLoginActions(({ login }) => (
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
))
