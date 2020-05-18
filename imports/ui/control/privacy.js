import React from 'react'
import styled from 'styled-components'
import accessLevels from '../../lib/access'
import Icon from '../visual/icon'
import { LabelledInput as Label } from '../visual/primitives'
import match from '../utils/match'
import { Form, Input, getInputValue, useFormFields, useFormSet } from './form'

const getPrivacyIcon = match({
	[accessLevels.PRIVATE]: 'lock',
	[accessLevels.CAMPAIGN]: 'double-team',
	[accessLevels.PUBLIC]: 'globe',
})

const getPrivacyLabel = match({
	[accessLevels.PRIVATE]: 'Only You',
	[accessLevels.CAMPAIGN]: 'Campaign',
	[accessLevels.PUBLIC]: 'Public',
})

const defaultAccess = { view: accessLevels.PRIVATE, edit: accessLevels.PRIVATE }

export const PrivacyIcon = ({ level }) => <Icon icon={getPrivacyIcon(level)} />

const Range = styled(Input)`
	width: ${({ max }) => (4 * max) / accessLevels.PUBLIC}em;
	vertical-align: middle;
`

const AccessSelect = ({ maxLevel = accessLevels.PUBLIC, ...props }) => (
	<Range
		{...props}
		type='range'
		min={accessLevels.PRIVATE}
		max={maxLevel}
		step={1}
		disabled={maxLevel === accessLevels.PRIVATE}
	/>
)

const AccessGrid = styled.div`
	display: grid;
	grid-template-areas:
		'label range text'
		'label range text';
	grid-column-gap: 0.5em;
	align-items: center;
`

const AccessLabel = styled(Label)`
	display: block;
	text-align: right;
`

const AccessText = styled.div`
	.ra,
	.fa {
		margin-right: 0.25em;
	}
`

const AccessForm = ({ access = defaultAccess, ...props }) => {
	const { view, edit } = useFormFields()
	const setFields = useFormSet()

	return (
		<Form tag='div' initialData={access} name='access' {...props}>
			<AccessGrid>
				<AccessLabel htmlFor='view'>Visible to</AccessLabel>
				<div>
					<AccessSelect
						name='view'
						id='view'
						onChange={ev => {
							setFields({
								edit: Math.min(getInputValue(ev.target), edit),
							})
						}}
					/>
				</div>
				<AccessText>
					<PrivacyIcon level={view} />
					{getPrivacyLabel(view)}
				</AccessText>
				<AccessLabel htmlFor='edit'>Editable by</AccessLabel>
				<div>
					<AccessSelect name='edit' id='edit' maxLevel={view} />
				</div>
				<AccessText>
					<PrivacyIcon level={edit} />
					{getPrivacyLabel(edit)}
				</AccessText>
			</AccessGrid>
		</Form>
	)
}

export default AccessForm
