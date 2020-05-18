import React from 'react'
import styled, { css } from 'styled-components'

import { Link } from 'use-history'
import { useImage } from '../data/image'
import { SplashBackground, Hero, HeroTitle } from '../visual/splash'
import { Card as CardPrimitive } from '../visual/primitives'
import Markdown from './markdown'

const CardHeaderBackground = styled(SplashBackground)`
	margin: -1rem -1rem 0;
	padding-top: 0.5rem;
	transition: filter 0.2s;
	will-change: filter;
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;

	${({ image }) =>
		image &&
		css`
			height: 6rem;
		`}

	a:hover & {
		filter: contrast(120%) brightness(95%) saturate(110%);
	}

	&:last-child {
		margin-bottom: -1rem;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
	}
`

const CardHeader = ({ card, ...props }) => {
	const { image } = useImage(card.cover)

	return <CardHeaderBackground {...props} image={image} />
}

const CardLink = styled(Link)`
	text-decoration: none;
	color: inherit;
	${({ card }) =>
		card &&
		css`
			grid-row: span ${3 + Boolean(card.cover) + Boolean(card.text)};
		`};

	${CardPrimitive} {
		height: 100%;
	}
`

const ListImageBackground = styled(SplashBackground)`
	min-height: 2rem;
	padding: 0.5rem;
	font-family: 'Libre Baskerville', serif;
	font-size: 0.8em;

	a:hover & {
		filter: contrast(120%) brightness(95%) saturate(110%);
	}
`

const ListImage = ({ card, ...props }) => {
	const { image } = useImage(card.cover)

	return <ListImageBackground {...props} image={image} />
}

export const CardListItem = ({ card, onClick }) => (
	<li>
		<CardLink
			href={card._id ? `/${card.campaignId}/${card._id}` : null}
			onClick={onClick}
		>
			<ListImage card={card}>{card.title}</ListImage>
		</CardLink>
	</li>
)

export default ({ card }) => (
	<CardLink
		card={card}
		href={card._id ? `/${card.campaignId}/${card._id}` : null}
	>
		<CardPrimitive>
			<CardHeader card={card}>
				<Hero>
					<HeroTitle>{card.title}</HeroTitle>
				</Hero>
			</CardHeader>

			<Markdown excerpt source={card.text || ''} />
		</CardPrimitive>
	</CardLink>
)
