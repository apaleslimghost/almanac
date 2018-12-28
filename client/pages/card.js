import React from 'react'
import { compose, withProps } from 'recompact'

import Markdown from '../document/markdown'
import withCards from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { SplashBleed, Hero, HeroBlurb, HeroTitle } from '../visual/splash'
import { ShowCard } from '../document/card'
import { Card as CardPrimitive } from '../visual/primitives'
import { FlexGrid } from '../visual/grid'

const withPageCard = withCards(
	'card',
	({ cardId }) => ({ _id: cardId }),
	{ single: true }
)

const withRelatedCards = withCards(
	'relatedCards',
	({ card }) => ({
		_id: { $in: (card && card.related) || [] },
	})
)

const withCardData = compose(
	withCampaignId,
	withPageCard,
	withRelatedCards,
	withLoading
)

const connectCardSplash = compose(
	withProps({ color: 'rgba(0,0,0,0.1)' })
)

export const CardSplash = connectCardSplash(
	({ card, ...props }) => (
		<SplashBleed small {...props}>
			<Hero>
				<HeroTitle>{card.title}</HeroTitle>
				{card.subtitle && (
					<HeroBlurb>
						{card.subtitle}
					</HeroBlurb>
				)}
			</Hero>
		</SplashBleed>
	)
)

export default withCardData(({ card, relatedCards }) => <>
	<CardSplash card={card} />

	<article>
		<Markdown source={card.text || ''} />
	</article>

	{relatedCards.length > 0 && <>
		<hr />
		<FlexGrid>
			{relatedCards.map(related => <CardPrimitive key={related._id}>
				<ShowCard card={related} />
			</CardPrimitive>)}
		</FlexGrid>
	</>}
</>)