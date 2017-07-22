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
import {TypeSelect} from './link-type';
import LabelInput from './label-input';

//TODO clean up these components
//TODO card categories?

export const EditCard = ({card, saveCard, toggle, deleteCard}) =>
	<Form
		onSubmit={data => {
			saveCard(data);
			if (toggle) toggle();
		}}
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
		deleteCard(card) {
			Cards.remove(card._id);
		},
	}),
	EditCard
);

const ShowCard = ({
	card,
	linkTypes,
	relatedByType,
	toggle,
	addRelated,
	removeRelated,
	selectCard,
}) =>
	<div>
		{card.relatedTypes &&
			<List>
				{card.relatedTypes.map(type =>
					<Label key={type._id} {...type.colour}>
						{type.name}
					</Label>
				)}
			</List>}

		{toggle && <Button onClick={toggle}>
			<LabelBody>
				<Icon icon='ion-edit' />
			</LabelBody>
		</Button>}
		<h1>
			<a href={`#${card._id}`} onClick={() => selectCard(card)}>
				{card.title}
			</a>
		</h1>
		<Markdown source={card.text || ''} />

		{linkTypes.map(
			type =>
				relatedByType[type._id] &&
				<div key={type._id}>
					<Label {...type.colour}>
						{type.name}
					</Label>

					<ul>
						{relatedByType[type._id].map(link =>
							<li key={link.cards[1]._id}>
								<a
									href={`#${link.cards[1]._id}`}
									onClick={() => selectCard(link.cards[1])}
								>
									{link.cards[1].title}
								</a>

								<a
									href="#"
									onClick={preventingDefault(() =>
										removeRelated(link)
									)}
								>
									×
								</a>
							</li>
						)}
					</ul>
				</div>
		)}

		<Form onSubmit={addRelated}>
			<TypeSelect />

			<CardSelect skip={[card._id]} />

			{/* TODO: card creation by adding link? */}

			<Button colour='aqua'>
				<LabelBody>
					<Icon icon="ion-link" /> Link
				</LabelBody>
			</Button>
		</Form>
	</div>;

const ShowCardContainer = createContainer(({card}) => {
	Meteor.subscribe('cards.links');
	Meteor.subscribe('links.types');

	const related = findJoined(CardLinks, {
		'cards.0': card._id,
	});

	return {
		linkTypes: Types.find().fetch(),
		relatedByType: _.groupBy(related, 'type._id'),
		addRelated(related) {
			CardLinks.insert({
				cards: [card._id, related.card],
				type: related.type,
			});
		},

		removeRelated({_id}) {
			CardLinks.remove(_id);
		},

		selectCard(cardToSelect) {
			Session.set('selectedCard', cardToSelect._id);
		},
	};
}, ShowCard);

const Card = props =>
	<CardPrimitive large={props.large}>
		<Toggler
			active={EditCardContainer}
			inactive={ShowCardContainer}
			{...props}
		/>
	</CardPrimitive>;

export default Card;
