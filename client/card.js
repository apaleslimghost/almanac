import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';

import {Cards} from '../src/collections';
import preventingDefault from '../src/preventing-default';

import Toggler from './toggler';
import {Card as CardPrimitive, Label, List} from './primitives';
import {Field, Form} from './form';
import CardSelect from './card-select';
import {Metadata, ShowMetadata} from './metadata';
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
		<Field name="text" />
		<Metadata data={card.metadata} />
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

		{card.metadata && <ShowMetadata card={card} />}

		<List>
			{relatedCards.map(related =>
				<Label onClick={() => removeRelated(related)} colour='aqua' key={related._id}>{related.title}</Label>
			)}
			<div>
				<CardSelect
					onSelect={addRelated}
					skip={[card._id].concat(card.related || [])}
				/>
			</div>
		</List>
	</div>;

const ShowCardContainer = createContainer(
	({card}) => ({
		relatedCards: Cards.find({_id: {$in: card.related || []}}).fetch(),
		addRelated(related) {
			Cards.update(card._id, {
				$addToSet: {related: related._id},
			});
		},
		removeRelated(related) {
			Cards.update(card._id, {
				$pull: {related: related._id},
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
