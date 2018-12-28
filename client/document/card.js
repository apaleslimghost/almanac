import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import _ from 'lodash'
import Markdown from 'react-markdown'
import { compose, withHandlers } from 'recompact'
import { withCampaignSession } from '../data/campaign'
import TypeSelect from '../collection/type-select'
import { Cards } from '../../shared/collections'
import schema from '../../shared/schema'
import preventingDefault from '../utils/preventing-default'
import Link from '../control/link'
import { Card, addRelated, removeRelated } from '../../shared/methods'
import { canEdit as canEditCard } from '../../shared/utils/validators/card'

import Toggler from '../control/toggler'
import {
	Card as CardPrimitive,
	Label,
	List,
	FormGroup,
	Button,
	LabelTitle,
	LabelBody,
	LabelledInput
} from '../visual/primitives'
import { Form, fieldLike } from '../control/form'
import { Input, Textarea } from '../visual/form'
import CardSelect from '../collection/card-select'
import Icon from '../visual/icon'
import AccessForm, { PrivacyIcons } from '../control/privacy'
import { iAmOwner } from '../data/owner'

const SchemaFields = (props, context) =>
	context.fields.type
		? (
			<FormGroup>
				{_.map(
					schema[context.fields.type].fields,
					({ label, format, ...field }, key) => (
						<LabelledInput key={key}>
							<div>{label}</div>
							<Input {...field} key={key} name={key} />
						</LabelledInput>
					)
				)}
			</FormGroup>
		)
		: null

SchemaFields.contextTypes = fieldLike

export const EditCard = ({ card, saveCard, toggle, deleteCard, isOwner }) => (
	<Form initialData={card} onDidSubmit={toggle} onSubmit={saveCard}>
		<FormGroup>
			<List>
				<Input flex name='title' placeholder='Title' />
				<TypeSelect name='type' placeholder='Type...' />
			</List>
		</FormGroup>

		{isOwner && <AccessForm {...card} />}

		<FormGroup>
			<Textarea fullWidth name='text' />
		</FormGroup>

		<SchemaFields />

		<List>
			<Button colour={card._id ? 'sky' : 'apple'}>
				{card._id ? <Icon icon='check' /> : <Icon icon='plus' />}
				{card._id ? 'Save' : 'Add'} card
			</Button>
			{toggle && (
				<Button colour='steel' onClick={preventingDefault(toggle)}>
					<Icon icon='times' /> Cancel
				</Button>
			)}
			{deleteCard && (
				<Button colour='scarlet' onClick={deleteCard}>
					<Icon icon='trash' /> Delete
				</Button>
			)}
		</List>
	</Form>
)

const editCardActions = withHandlers({
	saveCard: ({ card }) => data => {
		Card.update(card, data)
	},

	deleteCard: ({ card }) => ev => {
		ev.preventDefault()
		Card.delete(card)
	}
})

const connectEditCard = compose(
	editCardActions,
	iAmOwner('card')
)

const EditCardContainer = connectEditCard(EditCard)

export const ShowCard = ({
	card,
	toggle,
	relatedCards,
	removeCardRelated,
	addCardRelated,
	userId
}) => (
		<div>
			{card.type && (
				<Label colour='sky'>
					<LabelBody>{card.type}</LabelBody>
				</Label>
			)}

			<List>
				{toggle && canEditCard(card, userId) && (
					<Button onClick={toggle}>
						<Icon icon='edit' />
					</Button>
				)}
			</List>

			<PrivacyIcons access={card.access} />

			<article>
				<h1>
					<Link href={`/${card.campaignId}/${card._id}`}>{card.title}</Link>
				</h1>

				<Markdown source={card.text || ''} />
			</article>

			<List>
				{_.map(schema[card.type].fields, ({ label, format = a => a }, key) => (
					<Label key={key} sunken>
						<LabelTitle>{label}</LabelTitle>
						<LabelBody>{format(card[key])}</LabelBody>
					</Label>
				))}
			</List>

			{relatedCards && <List>
				{relatedCards.map(related => (
					<Label
						key={related._id}
						colour='aqua'
						onClick={() => removeCardRelated(related)}
					>
						<LabelBody>{related.title}</LabelBody>
					</Label>
				))}
				<div>
					<CardSelect
						skip={[card._id].concat(card.related || [])}
						placeholder='Link card...'
						onSelect={addCardRelated}
					/>
				</div>
			</List>}
		</div>
	)

const withCardData = withTracker(({ card, campaignId, campaignSession }) => ({
	// TODO: use withCard
	relatedCards: Cards.find({
		_id: { $in: card.related || [] },
		campaignId
	}).fetch(),

	addCardRelated(related) {
		addRelated(card, related)
	},

	removeCardRelated(related) {
		removeRelated(card, related)
	},

	userId: Meteor.userId()
}))

const connectCard = compose(
	withCampaignSession,
	withCardData
)

const ShowCardContainer = connectCard(ShowCard)

const CardWrapper = props => (
	<CardPrimitive large={props.large}>
		<Toggler
			active={EditCardContainer}
			inactive={ShowCardContainer}
			{...props}
		/>
	</CardPrimitive>
)

export default CardWrapper
