import styled, { css } from 'styled-components'
import * as FormControls from '../control/form'
import { Label } from './primitives'
import composeStyles from '@quarterto/styled-compose'

const defaultFormProps = props => ({
	colour: 'steel',
	shade: 4,
	sunken: true,
	large: true,
	...props,
})

const VisualInput = styled(Label).attrs(defaultFormProps)`
padding: .25em .3em;
margin: 0 .25em;
font: inherit;
${({ fullWidth }) =>
	fullWidth &&
	css`
		width: 100%;
	`}
${({ flex }) =>
	flex &&
	css`
		flex: 1;
	`}
${({ right }) =>
	right &&
	css`
		text-align: right;
	`}
${({ type }) =>
	type === 'search' &&
	css`
		padding: 0.25em 0.5em;
		border-radius: 1em;
	`}
`

export const Input = composeStyles(FormControls.Input, VisualInput)

export const BonelessInput = composeStyles(
	FormControls.Input,
	styled.input.attrs(defaultFormProps)`
		padding: 0 0.25em;
		font: inherit;
		color: inherit;
		background: transparent;
		border: 0 none;
		border-bottom-width: 0.05em;
		border-bottom-style: solid;
	`,
)

export const Textarea = composeStyles(
	'textarea',
	styled(Input)`
		resize: vertical;
		min-height: 20em;
		margin: 0;
	`,
)

const VisualSelect = styled(VisualInput).attrs(defaultFormProps)`
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='5'%3E%3Cpath d='M 5,5 0,0 10,0 Z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-size: 0.5em 0.25em;
	background-position: right 0.5em center;
	appearance: none;
	padding-right: 1.5em;

	&:invalid {
		color: rgba(0, 0, 0, 0.6);
	}
`

export const Select = composeStyles(FormControls.Select, VisualSelect)

export const BonelessSelect = composeStyles(
	FormControls.Select,
	styled.select.attrs(defaultFormProps)`
		border: 0 none;
		padding: 0 1.5em 0 1em;
		background-position: right 1em center;
	`,
)
