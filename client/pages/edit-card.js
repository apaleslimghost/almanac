import React from 'react'
import { compose, withHandlers, withProps } from 'recompact'

import styled from 'styled-components'
import { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { Form, withFormData } from '../control/form'
import { iAmOwner } from '../data/owner'
import TypeSelect from '../collection/type-select'
import preventingDefault from '../utils/preventing-default'
import { Card } from '../../shared/methods'
import { LabelledInput } from '../visual/primitives'
import { Input, Textarea, BonelessInput } from '../visual/form'
import AccessForm from '../control/privacy'
import Icon from '../visual/icon'
import schema from '../../shared/schema'
import { go } from '../utils/router'
import { ImageSelectModal } from '../control/image-select'
import { Main } from '../visual/grid'
import {
	SplashBleed,
	Hero,
	HeroTitle,
	SplashAccessory,
	HeroBlurb
} from '../visual/splash'
import withImage from '../data/image'
import {
	SplashToolbar,
	Center,
	Space,
	Divider,
	MenuButton,
	MenuItem
} from '../visual/menu'

const connectFormSplash = compose(
	withFormData,
	withProps({ small: true }),
	withImage(({ fields }) => fields.cover)
)

const FormCardSplash = connectFormSplash(SplashBleed)

const SchemaFields = withFormData(({ fields }) =>
	fields.type ? (
		<>
			{_.map(schema[fields.type].fields, ({ label, format, ...field }, key) => (
				<MenuItem key={key} flush>
					<LabelledInput>
						<div>{label}</div>
						<Input {...field} key={key} name={key} />
					</LabelledInput>
				</MenuItem>
			))}
			<Divider />
		</>
	) : null
)

const ContentsForm = withProps({
	tag: styled.form`
		display: contents;
	`
})(Form)

const FloatMenuItem = styled.div`
	display: flex;
	padding: 0 1rem;
	align-items: center;
	font-size: 0.9em;
`

const EditCard = ({ card = {}, saveCard, back, deleteCard, isOwner }) => (
	<ContentsForm initialData={card} onSubmit={saveCard}>
		<FormCardSplash>
			<SplashAccessory right>
				<ImageSelectModal name='cover' />
			</SplashAccessory>

			<Hero>
				<HeroTitle>
					<BonelessInput name='title' placeholder='Title' />
				</HeroTitle>
				<HeroBlurb>
					<BonelessInput name='subtitle' placeholder='Subtitle' />
				</HeroBlurb>
			</Hero>
		</FormCardSplash>

		<SplashToolbar>
			<Center>
				<TypeSelect name='type' placeholder='Type...' />
				<Divider />
				<SchemaFields />

				{(isOwner || !card._id) && (
					<>
						<AccessForm {...card} flush tag={FloatMenuItem} />
						<Divider />
					</>
				)}

				<Space />
				<MenuButton>
					{card._id ? <Icon icon='check' /> : <Icon icon='plus' />}
					{card._id ? 'Save' : 'Add'} card
				</MenuButton>
				{back && (
					<MenuButton onClick={preventingDefault(back)}>
						<Icon icon='times' /> Cancel
					</MenuButton>
				)}
				{deleteCard && card._id && (
					<MenuButton colour='scarlet' onClick={deleteCard}>
						<Icon icon='trash' /> Delete
					</MenuButton>
				)}
			</Center>
		</SplashToolbar>

		<Main>
			<Textarea fullWidth name='text' />
		</Main>
	</ContentsForm>
)

const editCardActions = withHandlers({
	saveCard: ({ card, campaignId }) => async data => {
		let _id

		if (card) {
			_id = card._id
			Card.update(card, data)
		} else {
			_id = (await Card.create({
				...data,
				campaignId
			}))._id
		}

		go(`/${campaignId}/${_id}`)
	},

	deleteCard: ({ card }) => ev => {
		ev.preventDefault()

		if (confirm(`Are you sure you want to delete ${card.title}?`)) {
			Card.delete(card)
			go(`/${card.campaignId}`)
		}
	},

	back: ({ card, campaignId }) => () => {
		go(`/${campaignId}/${card ? card._id : ''}`)
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
