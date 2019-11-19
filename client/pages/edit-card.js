import React from 'react'

import styled from 'styled-components'
import { navigate as go } from 'use-history'

import { useCard } from '../data/card'
import { useCampaignId } from '../data/campaign'
import { Form, useFormData } from '../control/form'
import { useAssertAmOwner } from '../data/owner'
import TypeSelect from '../collection/type-select'
import preventingDefault from '../utils/preventing-default'
import { Card } from '../../shared/methods'
import { LabelledInput } from '../visual/primitives'
import { Input, Textarea, BonelessInput } from '../visual/form'
import AccessForm from '../control/privacy'
import Icon from '../visual/icon'
import schema from '../../shared/schema'
import { ImageSelectModal } from '../control/image-select'
import { Main } from '../visual/grid'
import { SplashBleed, Hero, HeroTitle, SplashAccessory } from '../visual/splash'
import { useImage } from '../data/image'
import {
	SplashToolbar,
	Center,
	Space,
	Divider,
	MenuButton,
	MenuItem,
} from '../visual/menu'
import _ from 'lodash'

const FormCardSplash = props => {
	const { cover } = useFormData()
	const { image } = useImage(cover)

	return <SplashBleed small image={image} {...props} />
}

const SchemaFields = () => {
	const { type } = useFormData()
	return type ? (
		<>
			{_.map(schema[type].fields, ({ label, format, ...field }, key) => (
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
}

const ContentsForm = props => (
	<Form
		tag={styled.form`
			display: contents;
		`}
		{...props}
	/>
)

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
					<BonelessInput required name='title' placeholder='Title' />
				</HeroTitle>
			</Hero>
		</FormCardSplash>

		<SplashToolbar>
			<Center>
				<TypeSelect name='type' placeholder='Type...' />
				<Divider />
				<SchemaFields />

				{(isOwner || !card._id) && (
					<AccessForm {...card} flush tag={FloatMenuItem} />
				)}

				<Space />
				<MenuButton primary colour='apple' shade={3}>
					{card._id ? <Icon icon='check' /> : <Icon icon='plus' />}
					{card._id ? 'Save' : 'Create'}
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

export default ({ cardId, ...props }) => {
	const campaignId = useCampaignId()
	const { ready, card } = useCard(cardId)

	if (!ready) return null

	useAssertAmOwner(card)

	async function saveCard(data) {
		let _id

		if (card) {
			_id = card._id
			Card.update(card, data)
		} else {
			_id = (await Card.create({
				...data,
				campaignId,
			}))._id
		}

		go(`/${campaignId}/${_id}`)
	}

	function deleteCard(ev) {
		ev.preventDefault()

		if (confirm(`Are you sure you want to delete ${card.title}?`)) {
			Card.delete(card)
			go(`/${card.campaignId}`)
		}
	}

	function back() {
		go(`/${campaignId}/${card ? card._id : ''}`)
	}

	return <EditCard {...{ saveCard, deleteCard, back }} {...props} />
}
