import {compose, withProps} from 'recompact'
import {css} from 'styled-components'
import * as FormControls from '../control/form'
import {Label} from './primitives'

const withInputProps = withProps({
	colour: 'steel',
	shade: 4,
	sunken: true,
	large: true
})

const withSelectProps = compose(
	withInputProps,
	withProps({required: true})
)

const asTag = component => tag => withProps({tag})(component)
const asInput = asTag(FormControls.Input)
const asSelect = asTag(FormControls.Select)

const withInput = compose(
	withInputProps,
	asInput
)
const withSelect = compose(
	withSelectProps,
	asSelect
)

const BaseInput = Label.withComponent('input').extend`
	padding-left: .3em;
	padding-right: .3em;
	font: inherit;
	${({fullWidth}) =>
		fullWidth &&
		css`
			width: 100%;
		`}
	${({flex}) =>
		flex &&
		css`
			flex: 1;
		`}
	${({right}) =>
		right &&
		css`
			text-align: right;
		`}
`

export const Input = withInput(BaseInput)

export const Textarea = withInput(BaseInput.withComponent('textarea').extend`
	resize: vertical;
	min-height: 10em;
`)

export const Select = withSelect(BaseInput.withComponent('select').extend`
	background-image: url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='5'%3E%3Cpath d='M 5,5 0,0 10,0 Z'/%3E%3C/svg%3E');
	background-repeat: no-repeat;
	background-size: 0.5em 0.25em;
	background-position: right 0.5em center;
	appearance: none;
	padding-right: 1.5em;

	&:invalid {
		color: rgba(0, 0, 0, 0.6);
	}
`)
