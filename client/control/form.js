import React, { useState, createContext, useContext, useEffect } from 'react'

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

const FieldLike = createContext(null)

export const useFormContext = () =>
	useContext(FieldLike) || { fields: {}, setFields() {} }
export const useFormData = () => useFormContext().fields

const qq = (a, b) => (a === undefined ? b : a)

export const Input = ({
	name,
	fieldRef,
	tag: Tag = 'input',
	onChange,
	...props
}) => {
	const { fields, setFields } = useFormContext()

	return (
		<Tag
			ref={fieldRef}
			name={name}
			type='text'
			{...props}
			value={
				fields
					? qq(name in fields ? fields[name] : props.value, '')
					: 'value' in props
					? props.value
					: undefined /* uncontrolled component if there's no */
			}
			onChange={ev => {
				if (setFields) {
					if (props.type !== 'radio' || ev.target.checked) {
						setFields({
							[name]: getInputValue(ev.target),
						})
					}
				}

				if (onChange) {
					onChange(ev)
				}
			}}
		/>
	)
}

export const Select = ({ tag: Tag = 'select', ...props }) => {
	const { fields, setFields } = useFormContext()

	return (
		<Tag
			{...props}
			value={
				fields
					? (props.name in fields ? fields[props.name] : props.value) || ''
					: 'value' in props
					? props.value
					: undefined
			}
			onChange={ev => {
				if (props.onChange) {
					props.onChange(ev)
				}

				if (setFields) {
					setFields({
						[props.name]: getSelectValue(ev.target),
					})
				}
			}}
		>
			{props.children}
		</Tag>
	)
}

let c = 10

export const Form = ({
	initialData = {},
	name,
	tag: Tag = 'form',
	onChange,
	onSubmit: _onSubmit,
	onDidSubmit,
	...props
}) => {
	const {
		fields: contextFields,
		setFields: setContextFields,
	} = useFormContext()
	const initialFields = { ...initialData, ...contextFields }
	const [fields, _setFields] = useState(initialFields)

	useEffect(() => {
		if (setContextFields && name) {
			setContextFields({
				[name]: fields,
			})
		}

		if (onChange) {
			onChange(fields)
		}
	}, [fields, name, onChange, setContextFields])

	function setFields(childFields) {
		_setFields(currentFields => ({ ...currentFields, ...childFields }))
	}

	if (c--) {
		console.log({ contextFields, fields })
	}

	async function onSubmit(ev) {
		// TODO validation
		if (_onSubmit) {
			ev.preventDefault()

			await _onSubmit(fields)
			setFields(initialFields)

			if (onDidSubmit) {
				onDidSubmit(fields)
			}
		}
	}

	return (
		<FieldLike.Provider value={{ fields, setFields }}>
			<Tag {...props} {...(_onSubmit ? { onSubmit } : {})} />
		</FieldLike.Provider>
	)
}
