import React from 'react'
import styled from 'styled-components'
import { Form, Input as InputField, FormFieldData } from '../control/form'
import { Input, Select } from '../visual/form'
import { Button, LabelledInput as Label } from '../visual/primitives'
import unsplashImages from '../visual/unsplash.json'
import { calendarList } from '../data/calendar'

const ThemeSelector = styled.fieldset`
	overflow-x: auto;
`

const Themes = styled.div`
	display: flex;

	${Label} {
		display: block;
	}
`

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

		<ThemeSelector>
			<legend>Theme</legend>
			<Themes>
				{/* TODO: actual unsplash search. these images should be a collection */}
				{unsplashImages.map(image => (
					<Label key={image.id}>
						<InputField type='radio' name='theme' value={image.id} />
						<img
							src={image.urls.thumb}
							width={100}
							height={60}
							alt={image.user.name}
						/>
					</Label>
				))}
			</Themes>
		</ThemeSelector>

		{props.onSubmit && <Button>Save</Button>}
	</Form>
)
