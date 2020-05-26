import React from 'react'
import { action } from '@storybook/addon-actions'
import { Form } from '../imports/ui/control/form'
import { Input, Textarea, Select } from '../imports/ui/visual/form'

export default {
	title: 'Form',
}

export const input = () => (
	<Form onSubmit={action('form submit')}>
		<Input name='test' />
	</Form>
)

export const textarea = () => (
	<Form onSubmit={action('form submit')}>
		<Textarea name='test' />
	</Form>
)

export const select = () => (
	<Form onSubmit={action('form submit')}>
		<Select name='test'>
			<option>Option 1</option>
			<option>Option 2</option>
			<option>Option 3</option>
		</Select>
	</Form>
)

export const nested = () => (
	<Form onSubmit={action('form submit')}>
		<Form name='nest' tag={React.Fragment}>
			<Input name='test' />
		</Form>
	</Form>
)
