import React from 'react'
import styled from 'styled-components'
import accessLevels from '../../shared/access'
import Icon from '../visual/icon'
import { LabelledInput as Label } from '../visual/primitives'
import match from '../utils/match'
import { Form, FormFieldData, Input, getInputValue } from './form'

const getPrivacyIcon = match({
	[accessLevels.PRIVATE]: 'lock',
	[accessLevels.CAMPAIGN]: 'double-team',
	[accessLevels.PUBLIC]: 'globe'
})

const getPrivacyLabel = match({
	[accessLevels.PRIVATE]: 'Only You',
	[accessLevels.CAMPAIGN]: 'Campaign',
	[accessLevels.PUBLIC]: 'Public'
})

const defaultAccess = { view: accessLevels.PRIVATE, edit: accessLevels.PRIVATE }

export const PrivacyIcon = ({ level }) => <Icon icon={getPrivacyIcon(level)} />

const Range = styled(Input)`
	width: ${({ max }) => (60 * max) / accessLevels.PUBLIC}px;
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
`

const AccessLabel = Label.extend`
	display: block;
	text-align: right;
`

const AccessForm = ({ access = defaultAccess, ...props }) => (
	<Form tag='div' initialData={access} name='access' {...props}>
		<FormFieldData
			render={({ view, edit }, setFields) => (
				<AccessGrid>
					<AccessLabel htmlFor='view'>Visible to</AccessLabel>
					<div>
						<AccessSelect
							name='view'
							id='view'
							onChange={ev => {
								setFields({
									edit: Math.min(getInputValue(ev.target), edit)
								})
							}}
						/>
					</div>
					<div>
						<PrivacyIcon level={view} />
						{getPrivacyLabel(view)}
					</div>
					<AccessLabel htmlFor='edit'>Editable by</AccessLabel>
					<div>
						<AccessSelect name='edit' id='edit' maxLevel={view} />
					</div>
					<div>
						<PrivacyIcon level={edit} />
						{getPrivacyLabel(edit)}
					</div>
				</AccessGrid>
			)}
		/>
	</Form>
)

export default AccessForm
