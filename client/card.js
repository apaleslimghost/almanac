import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';

import {Cards} from '../src/collections';
import preventingDefault from '../src/preventing-default';

import Toggler from './toggler';
import {Card as CardPrimitive, Label, List} from './primitives';
import {Field, Form, Select} from './form';
import CardSelect from './card-select';
import {TypeSelect} from './link-type';
import LabelInput from './label-input';

export const EditCard = ({card, saveCard, toggle, deleteCard}) =>
	<Form
		onSubmit={data => {
			saveCard(data);
			if (toggle) toggle();
		}}
		initialData={card}
	>
		<Field name="title" />
		<Field name="text" tag='textarea' />
		<button>{toggle ? '✓' : '+'}</button>
		{toggle && <button onClick={preventingDefault(toggle)}>×</button>}
		{deleteCard &&
			<button onClick={preventingDefault(() => deleteCard(card))}>
				🗑
			</button>}
	</Form>;

const ShowCard = ({card, relatedCards, toggle, addRelated, removeRelated, selectCard}) =>
	<div>
		{toggle && <button onClick={toggle}>Edit</button>}
		<h1><a href={`#${card._id}`} onClick={selectCard}>{card.title}</a></h1>
		<p>{card.text}</p>

		<List>
			{relatedCards.map(related =>
				<Label onClick={() => removeRelated(related)} colour='aqua' key={related._id}>{related.title}</Label>
			)}
			<Form onSubmit={addRelated}>
				<TypeSelect />

				<CardSelect
					skip={[card._id]}
				/>

				<button>+</button>
			</Form>
		</List>
	</div>;

const ShowCardContainer = createContainer(
	({card}) => ({
		relatedCards: Cards.find({_id: {$in: card.related || []}}).fetch(),
		addRelated(related) {
			alert(JSON.stringify(related));
			Cards.update(card._id, {
				$push: {related},
			});
		},
		removeRelated(related) {
			Cards.update(card._id, {
				$pull: {related},
			});
		},
		selectCard() {
			Session.set('selectedCard', card._id);
		},
	}),
	ShowCard
);

const Card = props =>
	<CardPrimitive large={props.large}>
		<Toggler active={EditCard} inactive={ShowCardContainer} {...props} />
	</CardPrimitive>;

export default Card;
