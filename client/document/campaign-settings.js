import React from 'react'
import { Form, FormFieldData } from '../control/form'
import { Input, Select } from '../visual/form'
import { Button, LabelledInput as Label } from '../visual/primitives'
import { calendarList } from '../data/calendar'
import ImageSelect from '../control/image-select'

export default ({ campaign, ...props }) => (
	<Form initialData={campaign} {...props}>
		<Label>
			Name
			<Input required name='title' />
		</Label>

		{/* TODO most of this can be in an 'advanced settings' accordion? */}
		<Label>
			Tagline
			<FormFieldData
				render={({ username = 'user' }) => (
					<Input name='tagline' placeholder={`A campaign by ${username}`} />
				)}
			/>
		</Label>

		<Label>
			Calendar system
			<Select required name='calendar'>
				<option value=''>Select Calendar System</option>
				{calendarList.map(calendar => (
					<option key={calendar.id} value={calendar.id}>
						{calendar.name}
					</option>
				))}
			</Select>
		</Label>

		<ImageSelect name='theme' />

		{props.onSubmit && <Button>Save</Button>}
	</Form>
)
