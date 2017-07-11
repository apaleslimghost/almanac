import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import styled from 'styled-components';
import colours from '@quarterto/colours';

import {Types} from '../src/collections';
import {getSelectValue} from './form';

import {Form, fieldLike, Select} from './form';
import ColourSelect from './colour-select';
import {List, Label, LabelTitle, LabelButton, LabelBody} from './primitives';
import LabelInput from './label-input';
import Toggler from './toggler';
import preventingDefault from '../src/preventing-default';

const ColouredName = ({label = 'New type'}, {state}) =>
	<LabelInput label={label} {...state.colour} name="name" type="text" />;

ColouredName.contextTypes = fieldLike;

//TODO: link inverse
const EditType = ({type, saveType, toggle}) =>
	<Form
		initialData={type}
		onSubmit={data => {
			saveType(data);
			if (toggle) toggle();
		}}
	>
		<ColouredName label={type && 'Name'} />
		<ColourSelect name="colour" />
		<button>{type ? '✓' : '+'}</button>
		{toggle && <button onClick={preventingDefault(toggle)}>×</button>}
	</Form>;

const ShowType = ({type, toggle}) =>
	<Label {...type.colour} large>
		<LabelBody>{type.name}</LabelBody>
		<LabelButton {...type.colour} onClick={toggle}>Edit</LabelButton>
		<LabelButton {...type.colour}>Blah</LabelButton>
	</Label>;

const Type = props =>
	<Toggler
		active={EditType}
		inactive={ShowType}
		{...props}
		saveType={props.updateType}
	/>;

const TypeContainer = createContainer(
	() => ({
		updateType(type) {
			Types.update(type._id, type);
		},
	}),
	Type
);

//TODO: think about edit vs filter, ie what is this component
export const EditTypes = createContainer(
	() => ({
		types: Types.find({}).fetch(),
		addType(type) {
			Types.insert(type);
		},
	}),
	({types, addType}) =>
		<List>
			{types.map(type => <TypeContainer key={type._id} type={type} />)}

			<EditType saveType={addType} />
		</List>
);

export const TypeSelect = createContainer(
	{
		pure: false,
		getMeteorData: () => ({
			types: Types.find({}).fetch(),
		}),
	},
	({types}) =>
		<Select name="type">
			<option disabled value="" />

			{types.map(type =>
				<option value={type._id} key={type._id}>
					{type.name}
				</option>
			)}
		</Select>
);
