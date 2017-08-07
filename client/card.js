import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';
import Markdown from 'react-markdown';
import findJoined from '../src/find-joined';

import {Cards, Types, CardLinks} from '../src/collections';
import preventingDefault from '../src/preventing-default';

import Toggler from './toggler';
import {
	Card as CardPrimitive,
	Label,
	List,
	Input,
	Textarea,
	FormGroup,
	Button,
	Icon,
	LabelBody,
} from './primitives';
import {Field, Form, Select} from './form';
import CardSelect from './card-select';
import LabelInput from './label-input';

//TODO clean up these components
//TODO card categories?
//TODO button to move card to top and flip link if symmetric

export const EditCard = ({card, saveCard, toggle, deleteCard}) =>
	<Form
		onSubmit={saveCard}
		onDidSubmit={toggle}
		initialData={card}
	>
		<FormGroup>
			<Field name="title" placeholder="Title" tag={Input} />
		</FormGroup>

		<FormGroup>
			<Field name="text" tag={Textarea} />
		</FormGroup>

		<List>
			<Button colour={card._id ? 'sky' : 'apple'}>
				<LabelBody>
					{card._id ? <Icon icon="ion-checkmark" /> : <Icon icon="ion-plus" />}
					{card._id ? 'Save' : 'Add'} card
				</LabelBody>
			</Button>
			{toggle &&
				<Button onClick={preventingDefault(toggle)} colour="steel">
					<LabelBody>
						<Icon icon="ion-close" /> Cancel
					</LabelBody>
				</Button>}
			{deleteCard &&
				<Button
					onClick={preventingDefault(() => deleteCard(card))}
					colour="scarlet"
				>
					<LabelBody>
						<Icon icon="ion-trash-a" /> Delete
					</LabelBody>
				</Button>}
		</List>
	</Form>;

const EditCardContainer = createContainer(
	() => ({
		saveCard(card) {
			if (card._id) {
				Cards.update(card._id, {$set: _.omit(card, '_id')});
			} else {
				Cards.insert(card);
			}
		},

		deleteCard(card) {
			Cards.remove(card._id);

		},
	}),
	EditCard
);

const ShowCard = ({
	card,
	linkTypes,
	toggle,
	selectCard,
	selectAndFlip,
}) =>
	<div>
		<List>
			{toggle && <Button onClick={toggle}>
				<LabelBody>
					<Icon icon='ion-edit' />
				</LabelBody>
			</Button>}

			{card && <Button onClick={selectAndFlip}>
				<LabelBody>
					<Icon icon='ion-arrow-swap' />
				</LabelBody>
			</Button>}
		</List>

		<article>
			<h1>
				<a href={`#${card._id}`} onClick={selectCard}>
					{card.title}
				</a>
			</h1>

			<Markdown source={card.text || ''} />
		</article>
	</div>;

const ShowCardContainer = createContainer(({card}) => ({
	selectCard() {
		Session.set('selectedCard', card._id);
	},

	selectAndFlip() {
		Session.set('selectedCard', card._id);
		//TODO: once we have link type sorting, flip the link if it has an inverse
	}
}), ShowCard);

const Card = props =>
	<CardPrimitive large={props.large}>
		<Toggler
			active={EditCardContainer}
			inactive={ShowCardContainer}
			{...props}
		/>
	</CardPrimitive>;

export default Card;
