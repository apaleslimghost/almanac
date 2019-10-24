import React, { Component, useState, createContext } from 'react'
import PropTypes from 'prop-types'
import { getContext } from 'recompact'

export const getInputValue = el =>
	el[
		{
			number: 'valueAsNumber',
			range: 'valueAsNumber',
			date: 'valueAsDate',
			checkbox: 'checked',
			radio: 'value',
		}[el.type] || 'value'
	]

export const getSelectValue = el => el.options[el.selectedIndex].value

export const FormFieldData = ({ render }, context) =>
	render(context.fields, context.setFields)

const qq = (a, b) => (a === undefined ? b : a)

export const Input = (
	{ name, fieldRef, tag: Tag = 'input', ...props },
	context,
) => (
	<Tag
		ref={fieldRef}
		name={name}
		type='text'
		{...props}
		value={
			context.fields
				? qq(name in context.fields ? context.fields[name] : props.value, '')
				: 'value' in props
				? props.value
				: undefined /* Uncontrolled component if there's no context */
		}
		onChange={ev => {
			if (context.setFields) {
				if (props.type !== 'radio' || ev.target.checked) {
					context.setFields({
						[name]: getInputValue(ev.target),
					})
				}
			}

			if (props.onChange) {
				props.onChange(ev)
			}
		}}
	/>
)

export const Select = ({ tag: Tag = 'select', ...props }, context) => {
	return (
		<Tag
			{...props}
			value={
				context.fields
					? (props.name in context.fields
							? context.fields[props.name]
							: props.value) || ''
					: 'value' in props
					? props.value
					: undefined
			}
			onChange={ev => {
				if (props.onChange) {
					props.onChange(ev)
				}

				if (context.setFields) {
					context.setFields({
						[props.name]: getSelectValue(ev.target),
					})
				}
			}}
		>
			{props.children}
		</Tag>
	)
}

export const FieldLike = createContext({
	fields: {},
	setFields() {},
})

const Form = ({
	initialData = {},
	name,
	tag: Tag = 'form',
	onChange,
	onSubmit: _onSubmit,
	onDidSubmit,
	children,
}) => {
	const [fields, _setFields] = useState(initialData)
	const { fields: contextFields, setFields: setContextFields } = useContext(
		FieldLike,
	)

	function setFields(f) {
		_setFields(Object.assign(fields, f), () => {
			if (this.context.setFields && this.props.name) {
				this.context.setFields({
					[this.props.name]: this.fields,
				})
			}

			if (this.props.onChange) {
				this.props.onChange(this.fields)
			}
		})
	}

	function onSubmit(ev) {
		// TODO validation
		if (_onSubmit) {
			ev.preventDefault()

			Promise.resolve(_onSubmit(fields))
				.then(() => {
					setFields(this.props.initialData)
				})
				.then(() => {
					if (onDidSubmit) {
						onDidSubmit(this.fields)
					}
				})
		}
	}

	return (
		<FieldLike.Provider value={{ fields, setFields }}>
			<Tag {...(_onSubmit ? { onSubmit } : {})}>{children}</Tag>
		</FieldLike.Provider>
	)
}

export const fieldLike = {
	fields: PropTypes.object,
	setFields: PropTypes.func,
}

export const withFormData = getContext(fieldLike)
;[Input, Select, Form, FormFieldData].forEach(thing => {
	thing.contextTypes = fieldLike
})
