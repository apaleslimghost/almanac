import React from 'react';
import {Form, Input as InputField, FormFieldData} from '../control/form';
import {Input} from '../visual/form';
import {Button, LabelledInput as Label} from '../visual/primitives';
import unsplashImages from '../visual/unsplash.json';

export default ({campaign, ...props}) => <Form initialData={campaign} {...props}>
	<Label>
		Name
		<Input required name='title' />
	</Label>

	{/* TODO most of this can be in an "advanced settings" accordion? */}
	<Label>
		Tagline
		<FormFieldData
			render={
				({username = 'user'}) => <Input name='tagline' placeholder={`A campaign by ${username}`} />
			}
		/>
	</Label>

	<fieldset>
		<legend>Theme</legend>
		{unsplashImages.map(image => <Label key={image.id}>
			<InputField type='radio' name='theme' value={image.id} />
			<img src={image.urls.thumb} width={100} height={60} alt={image.user.name} />
		</Label>)}
	</fieldset>
</Form>;
