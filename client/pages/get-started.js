import React from 'react';
import {H2} from '../visual/heading';
import {Form, Field, FormFieldData} from '../control/form';
import {Input as BaseInput, Button} from '../visual/primitives';
import unsplashImages from '../visual/unsplash.json';

const Input = props => <Field tag={BaseInput} {...props} />;

export default ({title}) => <Form initialData={{title}}>
	<H2>About you</H2>
	<label>
		Username
		<Input required name='user' placeholder='user' />
	</label>

	<label>
		Email address
		<Input required name='email' type='email' placeholder='user@example.com' />
	</label>

	<small>We'll send you an email with a link to verify your address and set your password.</small>

	<H2>About your campaign</H2>
	<label>
		Name
		<Input required name='title' />
	</label>

	<label>
		Tagline
		<FormFieldData
			render={
				({user = 'user'}) => <Input name='tagline' placeholder={`A campaign by ${user}`} />
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
