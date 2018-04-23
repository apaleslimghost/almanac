import React from 'react';
import {H2} from '../visual/heading';
import {Form, Field, FormFieldData} from '../control/form';
import {Input as BaseInput, Button} from '../visual/primitives';
import unsplashImages from '../visual/unsplash.json';
import {createAccount} from '../../shared/methods';
import {go} from '../utils/router';

const Input = props => <Field tag={BaseInput} {...props} />;

const onSubmit = ({username, email, ...campaign}) => {
	createAccount({username, email}, campaign);
	// TODO success messaging
	go('/');
};

export default ({title}) => <Form initialData={{title}} onSubmit={onSubmit}>
	<H2>About you</H2>
	<label>
		Username
		<Input required name='username' placeholder='user' />
	</label>

	<label>
		Email address
		<Input required name='email' type='email' placeholder='user@example.com' />
	</label>

	<small>We'll send you an email with a link to verify your address and set your password.</small>

	{/* TODO move this to a campaign settings component and bring the calendar selector in */}
	<H2>About your campaign</H2>
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

	<Button>Create your account</Button>
</Form>;
