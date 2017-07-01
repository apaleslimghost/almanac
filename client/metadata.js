import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Fields} from '../src/collections';

import {Form, Field, Select} from './form';

const EditField = ({field, onSubmit}) => <Form initialData={field} onSubmit={onSubmit}>
	<Field name='name' type='text' />
	<button>{field ? '+' : '✓'}</button>
</Form>;

export const EditFields = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
		addField(field) {
			Fields.insert(field);
		},
	}),
	({fields, addField}) => <ul>
		{fields.map(({name, type}) => <li key={name}>{name}</li>)}

		<li><EditField onSubmit={addField} /></li>
	</ul>
)

const Metadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),

	({fields, metadata}) => <Form initialData={metadata} name='metadata' tagName='fieldset'>
		{fields.map(field => <Field key={field.name} name={field.name} />)}
	</Form>
);

export default Metadata;
