import React from 'react'
import { compose, withProps, withHandlers } from 'recompact'

import { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { Form, fieldLike } from '../control/form'
import { iAmOwner } from '../data/owner'
import TypeSelect from '../collection/type-select'
import preventingDefault from '../utils/preventing-default'
import { Card } from '../../shared/methods'
import {
	Button,
	List,
	FormGroup,
	LabelledInput
} from '../visual/primitives'
import { Input, Textarea } from '../visual/form'
import AccessForm from '../control/privacy'
import Icon from '../visual/icon'
import schema from '../../shared/schema'
import { go } from '../utils/router'

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

export const EditCard = ({ card, saveCard, back, deleteCard, isOwner }) => (
	<Form initialData={card} onDidSubmit={back} onSubmit={saveCard}>
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
			{back && (
				<Button colour='steel' onClick={preventingDefault(back)}>
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
		go(`/${card.campaignId}`)
		Card.delete(card)
	},

	back: ({ card }) => () => {
		go(`/${card.campaignId}/${card._id}`)
	}
})

const withCardData = compose(
	withCampaignId,
	withCard,
	withLoading,
	editCardActions,
	iAmOwner('card')
)

export default withCardData(EditCard)