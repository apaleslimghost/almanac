import React from 'react'
import styled from 'styled-components'
import accessLevels from '../../shared/access'
import Icon from '../visual/icon'
import { LabelledInput as Label, FormGroup } from '../visual/primitives'
import { Form, FormFieldData, Input, getInputValue } from './form'

const match = matches => value =>
	value in matches ? matches[value] : matches.default

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

const PrivacyIcon = ({ level }) => <Icon icon={getPrivacyIcon(level)} />

export const PrivacyIcons = ({ access = defaultAccess }) => (
	<>
		<span>
			view <PrivacyIcon level={access.view} />
		</span>
		<span>
			edit <PrivacyIcon level={access.edit} />
		</span>
	</>
)

const Range = styled(Input)`
	width: ${({ max }) => (100 * max) / accessLevels.PUBLIC}px;
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

const AccessForm = ({ access = defaultAccess }) => (
	<Form tag={FormGroup} initialData={access} name='access'>
		<FormFieldData
			render={({ view, edit }, setFields) => (
				<>
					<Label>
						Visible to
						<AccessSelect
							name='view'
							onChange={ev => {
								setFields({
									edit: Math.min(getInputValue(ev.target), edit)
								})
							}}
						/>
						<PrivacyIcon level={view} />
						{getPrivacyLabel(view)}
					</Label>
					<Label>
						Editable by
						<AccessSelect name='edit' maxLevel={view} />
						<PrivacyIcon level={edit} />
						{getPrivacyLabel(edit)}
					</Label>
				</>
			)}
		/>
	</Form>
)

export default AccessForm
