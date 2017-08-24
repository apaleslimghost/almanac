import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import styled from 'styled-components';
import colours from '@quarterto/colours';
import _ from 'lodash';

import {Types, Cards} from '../src/collections';
import {getSelectValue} from './form';

import {Form, fieldLike, Select} from './form';
import ColourSelect from './colour-select';
import TypeSelect from './type-select';
import {List, Label, LabelTitle, LabelButton, LabelBody, Button, Icon, Padded} from './primitives';
import LabelInput from './label-input';
import Toggler from './toggler';
import preventingDefault from '../src/preventing-default';
import subscribe from '../src/subscribe';
import idFirst from '../src/id-first';

const ColouredName = ({type, toggle, deleteType}, {state}) =>
	<LabelInput {...state.colour} placeholder='Link type' name="name" type="text">
		<ColourSelect name="colour" />
		<TypeSelect name="inverse" />
		{type && <LabelButton {...state.colour} onClick={preventingDefault(() => deleteType(type))}>
			<Icon icon='ion-trash-a' />
		</LabelButton>}
		{toggle && <LabelButton {...state.colour} onClick={preventingDefault(toggle)}>
			<Icon icon='ion-close' />
		</LabelButton>}
		<LabelButton {...state.colour}>
			{type
				? <Icon icon='ion-checkmark' />
				: <Icon icon='ion-plus' />}
		</LabelButton>
	</LabelInput>;

ColouredName.contextTypes = fieldLike;

//TODO: links only accepting certain categories?
//TODO: single edit toggle

const EditType = ({type, saveType, toggle, deleteType}) =>
	<Form
		initialData={type}
		onSubmit={saveType}
		onDidSubmit={toggle}
	>
		<ColouredName {...{type, toggle, deleteType}} />
	</Form>;

const ShowType = ({type, toggle, selectType}) =>
	<Label {...type.colour} large>
		<LabelButton {...type.colour} onClick={() => selectType(type)}>{type.name}</LabelButton>
		<LabelButton {...type.colour} onClick={toggle}>
			<Icon icon='ion-edit' />
		</LabelButton>
	</Label>;

const TypeContainer = createContainer(
	() => ({
		updateType(type) {
			if(type.inverse) {
				Meteor.call('links.fixInverse', {type}, doUpdate);
			} else doUpdate();

			function doUpdate(err) {
				if(err) return console.error(err);
				Types.update(type._id, {$set: _.omit(type, '_id')});
			}
		},

		deleteType(type) {
			if(confirm(`
				Are you sure? This will remove ${type.name} and all ${type.name} links.
			`.trim())) {
				Meteor.call('links.removeOfType', {type}, err => {
					if(err) {
						console.error(err);
					} else {
						Types.remove(type._id);
					}
				});
			}
		},

		selectType(type) {
			Session.set('selectedType', type._id);
		},
	}),
	props =>
		<Toggler
			active={EditType}
			inactive={ShowType}
			{...props}
			saveType={props.updateType}
		/>
);

export const EditTypes = createContainer(
	() => ({
		ready: subscribe('links.types'),
		types: idFirst(
			Types.find({}).fetch(),
			Session.get('selectedType')
		),
		addType(type) {
			Types.insert(type);
		},
	}),
	({types, addType, deleteType}) =>
		<Padded>
			<List>
				{types.map(type => <TypeContainer key={type._id} type={type} />)}

				<EditType saveType={addType} />
			</List>
		</Padded>
);

// export const TypeSelect = createContainer(
// 	{
// 		pure: false,
// 		getMeteorData: () => ({
// 			types: Types.find({}).fetch(),
// 		}),
// 	},
// 	({types}) =>
// 		<Select name="type">
// 			<option disabled value="" />
//
// 			{types.map(type =>
// 				<option value={type._id} key={type._id}>
// 					{type.name}
// 				</option>
// 			)}
// 		</Select>
// );
