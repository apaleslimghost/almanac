import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import styled from 'styled-components';
import colours from '@quarterto/colours';

import {Fields} from '../src/collections';

import {Form, fieldLike} from './form';
import ColourSelect from './colour-select';
import {List, Label, LabelTitle} from './primitives';
import LabelInput from './label-input';
import Toggler from './toggler';

const ColouredName = ({}, {state}) =>
	<LabelInput label='New field' {...state.colour} name='_id' type='text' />;

ColouredName.contextTypes = fieldLike;

const EditField = ({field, onSubmit}) => <Form initialData={field} onSubmit={onSubmit}>
	<ColouredName />
	<ColourSelect name='colour' />
	<button>{field ? '+' : '✓'}</button>
</Form>;

const ShowField = ({field, toggle}) =>
	<Label {...field.colour} key={field._id}>{field._id}</Label>;

const Field = props =>
	<Toggler active={EditField} inactive={ShowField} {...props} />

export const EditFields = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
		addField(field) {
			Fields.insert(field);
		},
		updateField(field) {
			Fields.update(field._id, field);
		},
	}),
	({fields, addField}) => <List>
		{fields.map(field => <Field key={field._id} field={field} />)}

		<EditField onSubmit={addField} />
	</List>
);

export const Metadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),

	({fields, metadata}) => <Form initialData={metadata} name='metadata' tagName='fieldset'>
		{fields.map(field => <LabelInput label={field._id} {...field.colour} minWidth={70} key={field._id} name={field._id} />)}
	</Form>
);

export const ShowMetadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),

	({fields, card}) => <List>
		{fields.map(field => card.metadata[field._id] && <Label key={field._id} {...field.colour}>
			<LabelTitle {...field.colour}>
				{field._id}
			</LabelTitle>

			{card.metadata[field._id]}
		</Label>)}
	</List>
);
