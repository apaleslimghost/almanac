import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import styled from 'styled-components';
import colours from '@quarterto/colours';

import {Fields} from '../src/collections';

import {Form, Field, Select, fieldLike} from './form';
import ColourSelect from './colour-select';
import {Label} from './primitives';

const ColouredField = styled(Field)`
	border-color: ${({colour = 'steel', shade = 3}) => colours[colour][shade]};
`;

const ColouredName = ({}, {state}) =>
	<ColouredField {...state.colour} name='name' type='text' />;

ColouredName.contextTypes = fieldLike;

const EditField = ({field, onSubmit}) => <Form initialData={field} onSubmit={onSubmit}>
	<ColouredName />
	<ColourSelect name='colour' />
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
		{fields.map(({_id, name, type, colour = {}}) => <li key={_id}><Label {...colour}>{name}</Label></li>)}

		<li><EditField onSubmit={addField} /></li>
	</ul>
);

const Metadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),

	({fields, metadata}) => <Form initialData={metadata} name='metadata' tagName='fieldset'>
		{fields.map(field => <Field key={field._id} name={field.name} />)}
	</Form>
);

export default Metadata;
