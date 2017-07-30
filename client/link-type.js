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

//TODO: link inverse (by marking another type as inverse of this)
//TODO: set inverse inverse, ensure only one inverse
//TODO: links only accepting certain categories?
//TODO: single edit toggle
//TODO: click type to sort to top

const EditType = ({type, saveType, toggle, deleteType}) =>
	<Form
		initialData={type}
		onSubmit={saveType}
		onDidSubmit={toggle}
	>
		<ColouredName {...{type, toggle, deleteType}} />
	</Form>;

const ShowType = ({type, toggle}) =>
	<Label {...type.colour} large>
		<LabelBody>{type.name}</LabelBody>
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
				Meteor.call('links.removeOfType', {type: type._id}, err => {
					if(err) {
						console.error(err);
					} else {
						Types.remove(type._id);
					}
				});
			}
		},
	}),
	props =>
		<Toggler
			active={EditType}
			inactive={ShowType}
			{...props}
			saveType={props.updateType}
			deleteType={props.deleteType}
		/>
);

//TODO: think about edit vs filter, ie what is this component
export const EditTypes = createContainer(
	() => ({
		ready: Meteor.subscribe('links.types').ready(),
		types: Types.find({}).fetch(),
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
