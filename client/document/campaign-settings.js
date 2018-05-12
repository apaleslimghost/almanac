import React from 'react';
import {Form, Field, FormFieldData} from '../control/form';
import {Input as BaseInput, Button} from '../visual/primitives';
import unsplashImages from '../visual/unsplash.json';

const Input = props => <Field tag={BaseInput} {...props} />;

export default ({campaign, ...props}) => <Form initialData={campaign} {...props}>
	<label>
		Name
		<Input required name='title' />
	</label>

	{/* TODO most of this can be in an "advanced settings" accordion? */}
	<label>
		Tagline
		<FormFieldData
			render={
				({username = 'user'}) => <Input name='tagline' placeholder={`A campaign by ${username}`} />
			}
		/>
	</label>

	<fieldset>
		<legend>Theme</legend>
		{unsplashImages.map(image => <label key={image.id}>
			<Field type='radio' name='theme' value={image.id} />
			<img src={image.urls.thumb} width={100} height={60} alt={image.user.name} />
		</label>)}
	</fieldset>
</Form>;
