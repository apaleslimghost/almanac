import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import styled from 'styled-components';
import colours from '@quarterto/colours';

import {Fields} from '../src/collections';

import {Form, fieldLike} from './form';
import ColourSelect from './colour-select';
import {List, Label, LabelTitle, LabelButton} from './primitives';
import LabelInput from './label-input';
import Toggler from './toggler';
import preventingDefault from '../src/preventing-default';

const ColouredName = ({label = 'New field'}, {state}) =>
	<LabelInput label={label} {...state.colour} name="name" type="text" />;

ColouredName.contextTypes = fieldLike;

const EditField = ({field, saveField, toggle}) =>
	<Form
		initialData={field}
		onSubmit={data => {
			saveField(data);
			if (toggle) toggle();
		}}
	>
		<ColouredName label={field && 'Name'} />
		<ColourSelect name="colour" />
		<button>{field ? '✓' : '+'}</button>
		{toggle && <button onClick={preventingDefault(toggle)}>×</button>}
	</Form>;

const ShowField = ({field, toggle}) =>
	<Label {...field.colour} large>
		<span>{field.name}</span>
		<LabelButton {...field.colour} onClick={toggle}>Edit</LabelButton>
	</Label>;

const Field = props =>
	<Toggler
		active={EditField}
		inactive={ShowField}
		{...props}
		saveField={props.updateField}
	/>;

const FieldContainer = createContainer(
	() => ({
		updateField(field) {
			Fields.update(field._id, field);
		},
	}),
	Field
);

export const EditFields = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
		addField(field) {
			Fields.insert(field);
		},
	}),
	({fields, addField}) =>
		<List>
			{fields.map(field => <FieldContainer key={field._id} field={field} />)}

			<EditField saveField={addField} />
		</List>
);

export const Metadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),
	({fields, metadata}) =>
		<Form initialData={metadata} name="metadata" tagName="fieldset">
			{fields.map(field =>
				<LabelInput
					label={field.name}
					{...field.colour}
					minWidth={70}
					key={field._id}
					name={field._id}
				/>
			)}
		</Form>
);

export const ShowMetadata = createContainer(
	() => ({
		fields: Fields.find({}).fetch(),
	}),
	({fields, card}) =>
		<List>
			{fields.map(
				field =>
					card.metadata[field._id] &&
					<Label key={field._id} {...field.colour}>
						<LabelTitle {...field.colour}>
							{field.name}
						</LabelTitle>

						<span>{card.metadata[field._id]}</span>
					</Label>
			)}
		</List>
);
