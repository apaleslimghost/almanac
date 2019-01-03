import React from 'react'
import { compose } from 'recompact'
import styled from 'styled-components'
import Markdown from '../document/markdown'
import withCards, { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { SplashBleed, Hero, HeroBlurb, HeroTitle } from '../visual/splash'
import ShowCard from '../document/card'
import { canEdit as canEditCard } from '../../shared/utils/validators/card'
import { withUserData } from '../utils/logged-in'
import Icon from '../visual/icon'
import Title from '../utils/title'
import schema from '../../shared/schema'
import { Owner } from '../document/user'
import {
	SplashToolbar,
	MenuItem,
	MenuLink,
	Space,
	Divider,
	Center
} from '../visual/menu'
import withImage from '../data/image'
import { CardHistoryList } from '../collection/card-history'

const withRelatedCards = withCards('relatedCards', ({ card }) => ({
	_id: { $in: (card && card.related) || [] }
}))

const withCardData = compose(
	withCampaignId,
	withCard,
	withRelatedCards,
	withUserData,
	withLoading
)

const connectCardSplash = withImage(({ card }) => card.cover)

export const CardSplash = connectCardSplash(({ card, ...props }) => (
	<SplashBleed small {...props}>
		<Hero>
			<HeroTitle>{card.title}</HeroTitle>
			{card.subtitle && <HeroBlurb>{card.subtitle}</HeroBlurb>}
		</Hero>
	</SplashBleed>
))

const CardBody = styled.article`
	grid-column: main-left;
`

const Right = styled.aside`
	grid-column: right;
`

export default withCardData(({ card, relatedCards, user, image }) => (
	<>
		<CardSplash card={card} />
		<Title>{card.title}</Title>

		<SplashToolbar>
			<Center>
				<MenuItem>{schema[card.type].name}</MenuItem>

				<Divider />

				{_.map(schema[card.type].fields, ({ label, format = a => a }, key) => (
					<MenuItem key={key}>
						<b>{label} </b>
						{format(card[key])}
					</MenuItem>
				))}

				<Divider />

				<MenuItem>
					<Owner of={card} />
				</MenuItem>

				<Space />
				{canEditCard(card, user._id) && (
					<MenuLink href={`/${card.campaignId}/${card._id}/edit`}>
						<Icon icon='edit' />
						Edit
					</MenuLink>
				)}
			</Center>
		</SplashToolbar>

		<CardBody>
			<Markdown source={card.text || ''} />
		</CardBody>

		<Right>
			{relatedCards.length > 0 &&
				relatedCards.map(related => (
					<ShowCard key={related._id} card={related} />
				))}

			<CardHistoryList card={card} />
		</Right>
	</>
))
