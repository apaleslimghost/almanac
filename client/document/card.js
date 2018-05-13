import {Meteor} from 'meteor/meteor';
import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import _ from 'lodash';
import Markdown from 'react-markdown';
import {withCampaignSession} from '../data/campaign';
import {compose, withHandlers} from 'recompact';
import TypeSelect from '../collection/type-select';
import {Cards} from '../../shared/collections';
import schema from '../../shared/schema';
import preventingDefault from '../utils/preventing-default';
import Link from '../control/link';
import {Card, addRelated, removeRelated} from '../../shared/methods';

import Toggler from '../control/toggler';
import {
	Card as CardPrimitive,
	Label,
	List,
	FormGroup,
	Button,
	LabelTitle,
	LabelBody,
	LabelledInput,
} from '../visual/primitives';
import {Form, fieldLike} from '../control/form';
import {Input, Textarea} from '../visual/form';
import CardSelect from '../collection/card-select';
import Icon from '../visual/icon';

const SchemaFields = (props, context) => context.fields.type ? <FormGroup>
	{_.map(
		schema[context.fields.type].fields,
		({label, ...field}, key) => <LabelledInput key={key}>
			<div>{label}</div>
			<Input {...field} name={key} key={key} />
		</LabelledInput>
	)}
</FormGroup> : null;

SchemaFields.contextTypes = fieldLike;

export const EditCard = ({card, saveCard, toggle, deleteCard}) =>
	<Form
		onSubmit={saveCard}
		onDidSubmit={toggle}
		initialData={card}
	>
		<FormGroup>
			<List>
				<Input name="title" placeholder="Title" flex />
				<TypeSelect name="type" placeholder="Type..." />
			</List>
		</FormGroup>

		<FormGroup>
			<Textarea name="text" fullWidth />
		</FormGroup>

		<SchemaFields />

		<List>
			<Button colour={card._id ? 'sky' : 'apple'}>
				{card._id ? <Icon icon="check" /> : <Icon icon="plus" />}
				{card._id ? 'Save' : 'Add'} card
			</Button>
			{toggle &&
				<Button onClick={preventingDefault(toggle)} colour="steel">
					<Icon icon="times" /> Cancel
				</Button>}
			{deleteCard &&
				<Button
					onClick={deleteCard}
					colour="scarlet"
				>
					<Icon icon="trash" /> Delete
				</Button>}
		</List>
	</Form>;

const connectEditCard = withHandlers({
	saveCard: ({card}) => data => {
		Card.update(card, data);
	},

	deleteCard: ({card}) => ev => {
		ev.preventDefault();
		Card.delete(card);
	},
});

const EditCardContainer = connectEditCard(EditCard);

const ShowCard = ({
	card,
	toggle,
	relatedCards,
	removeRelated,
	addRelated,
}) =>
	<div>
		{card.type && <Label colour='sky'>
			<LabelBody>
				{card.type}
			</LabelBody>
		</Label>}

		<List>
			{toggle && <Button onClick={toggle}>
				<Icon icon='edit' />
			</Button>}
		</List>

		<article>
			<h1>
				<Link href={`/${card.campaignId}/${card._id}`}>
					{card.title}
				</Link>
			</h1>

			<Markdown source={card.text || ''} />
		</article>

		<List>
			{_.map(
				schema[card.type].fields,
				({label, format = a => a}, key) => <Label key={key} sunken>
					<LabelTitle>{label}</LabelTitle>
					<LabelBody>{format(card[key])}</LabelBody>
				</Label>
			)}
		</List>

		<List>
			{relatedCards.map(related =>
				<Label onClick={() => removeRelated(related)} colour='aqua' key={related._id}>
					<LabelBody>
						{related.title}
					</LabelBody>
				</Label>
			)}
			<div>
				<CardSelect
					onSelect={addRelated}
					tag={SelectPrimitive}
					skip={[card._id].concat(card.related || [])}
					placeholder='Link card...'
				/>
			</div>
		</List>
	</div>;

const withCardData = withTracker(({card, campaignId, campaignSession}) => ({
	// TODO: use withCard
	relatedCards: Cards.find({_id: {$in: card.related || []}, campaignId}).fetch(),
	addRelated(related) {
		addRelated(card, related);
	},

	removeRelated(related) {
		removeRelated(card, related);
	},
}));

const connectCard = compose(withCampaignSession, withCardData);

const ShowCardContainer = connectCard(ShowCard);

const CardWrapper = props =>
	<CardPrimitive large={props.large}>
		<Toggler
			active={EditCardContainer}
			inactive={ShowCardContainer}
			{...props}
		/>
	</CardPrimitive>;

export default CardWrapper;
