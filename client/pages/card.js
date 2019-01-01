import React from 'react'
import { compose } from 'recompact'

import Markdown from '../document/markdown'
import withCards, { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { SplashBleed, Hero, HeroBlurb, HeroTitle } from '../visual/splash'
import ShowCard from '../document/card'
import { FlexGrid, bleed } from '../visual/grid'
import { canEdit as canEditCard } from '../../shared/utils/validators/card'
import { withUserData } from '../utils/logged-in'
import Icon from '../visual/icon'
import Title from '../utils/title'
import schema from '../../shared/schema'
import { Owner } from '../document/user'
import {
	Toolbar,
	MenuItem,
	MenuLink,
	Space,
	Divider,
	Center
} from '../visual/menu'
import withImage from '../data/image'

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

const SplashToolbar = Toolbar.extend.attrs({ className: bleed })`
	margin-top: -1rem;
	grid-area: bleed;
`

export const CardSplash = connectCardSplash(({ card, ...props }) => (
	<SplashBleed small {...props}>
		<Hero>
			<HeroTitle>{card.title}</HeroTitle>
			{card.subtitle && <HeroBlurb>{card.subtitle}</HeroBlurb>}
		</Hero>
	</SplashBleed>
))

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

		<article>
			<Markdown source={card.text || ''} />
		</article>

		{relatedCards.length > 0 && (
			<>
				<hr />
				<FlexGrid>
					{relatedCards.map(related => (
						<ShowCard key={related._id} card={related} />
					))}
				</FlexGrid>
			</>
		)}
	</>
))
