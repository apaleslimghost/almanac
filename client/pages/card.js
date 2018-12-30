import React from 'react'
import { compose, withProps } from 'recompact'

import Markdown from '../document/markdown'
import withCards, { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { SplashBleed, Hero, HeroBlurb, HeroTitle } from '../visual/splash'
import ShowCard from '../document/card'
import { LabelTitle, Label, LabelBody } from '../visual/primitives'
import { FlexGrid } from '../visual/grid'
import ActionBar from '../visual/action-bar'
import { canEdit as canEditCard } from '../../shared/utils/validators/card'
import { withUserData } from '../utils/logged-in'
import Link from '../control/link'
import Icon from '../visual/icon'
import Title from '../utils/title'
import { PrivacyIcons } from '../control/privacy'
import schema from '../../shared/schema'

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

const connectCardSplash = compose(withProps({ color: '#e0d8d2' }))

export const CardSplash = connectCardSplash(({ card, ...props }) => (
	<SplashBleed small {...props}>
		<Hero>
			<HeroTitle>{card.title}</HeroTitle>
			{card.subtitle && <HeroBlurb>{card.subtitle}</HeroBlurb>}
		</Hero>
	</SplashBleed>
))

export default withCardData(({ card, relatedCards, user }) => (
	<>
		<CardSplash card={card} />
		<Title>{card.title}</Title>

		<ActionBar>
			<Label colour='sky'>
				<LabelBody>{card.type}</LabelBody>
			</Label>

			{canEditCard(card, user._id) && (
				<Link href={`/${card.campaignId}/${card._id}/edit`}>
					<Icon icon='edit' />
					Edit
				</Link>
			)}
			<PrivacyIcons access={card.access} />

			{_.map(schema[card.type].fields, ({ label, format = a => a }, key) => (
				<Label key={key} sunken>
					<LabelTitle>{label}</LabelTitle>
					<LabelBody>{format(card[key])}</LabelBody>
				</Label>
			))}
		</ActionBar>

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
