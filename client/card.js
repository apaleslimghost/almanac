import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import _ from 'lodash';
import Markdown from 'react-markdown';

import {Cards, Types} from '../src/collections';
import preventingDefault from '../src/preventing-default';

import Toggler from './toggler';
import {Card as CardPrimitive, Label, List} from './primitives';
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
		{/* TODO: card form ui (wysiwyg/m for markdown?) */}
		<Field name="title" />
		<Field name="text" tag="textarea" />
		<button>{toggle ? '✓' : '+'}</button>
		{toggle && <button onClick={preventingDefault(toggle)}>×</button>}
		{deleteCard &&
			<button onClick={preventingDefault(() => deleteCard(card))}>
				🗑
			</button>}
	</Form>;

const ShowCard = ({
	card,
	linkTypes,
	related,
	toggle,
	addRelated,
	removeRelated,
	selectCard,
}) =>
	<div>
		{card.relatedTypes &&
			<List>
				{card.relatedTypes.map(type =>
					<Label key={type._id} {...type.colour}>{type.name}</Label>
				)}
			</List>}

		{toggle && <button onClick={toggle}>Edit</button>}
		<h1><a href={`#${card._id}`} onClick={() => selectCard(card)}>{card.title}</a></h1>
		<Markdown source={card.text || ''} />

		{linkTypes.map(
			type =>
				related[type._id] &&
				<div key={type._id}>
					<Label {...type.colour}>{type.name}</Label>

					<ul>
						{related[type._id].map(({card, related}) =>
							<li key={card._id}>
								<a href={`#${card._id}`} onClick={() => selectCard(card)}>{card.title}</a>

								<a href='#' onClick={preventingDefault(() => removeRelated(related))}>×</a>
							</li>
						)}
					</ul>
				</div>
		)}

		<Form onSubmit={addRelated}>
			<TypeSelect />

			<CardSelect skip={[card._id]} />

			{/* TODO: card creation by adding link */}
			<button>+</button>
		</Form>
	</div>;

const ShowCardContainer = createContainer(({card}) => {
	const relatedIds = (card.related || []).map(related => related.card);
	const relatedCards = Cards.find({_id: {$in: relatedIds}}).fetch();
	const relatedById = _.keyBy(relatedCards, '_id');
	const relatedByType = _.groupBy(card.related || [], 'type');

	const related = _.mapValues(relatedByType, related =>
		related.map(r => ({
			related: r,
			card: relatedById[r.card],
		}))
	);

	return {
		linkTypes: Types.find().fetch(),
		related,
		addRelated(related) {
			Cards.update(card._id, {
				$push: {related},
			});
		},
		removeRelated(related) {
			Cards.update(card._id, {
				$pull: {related},
			});
		},
		selectCard(cardToSelect) {
			Session.set('selectedCard', cardToSelect._id);
		},
	};
}, ShowCard);

const Card = props =>
	<CardPrimitive large={props.large}>
		<Toggler active={EditCard} inactive={ShowCardContainer} {...props} />
	</CardPrimitive>;

export default Card;
