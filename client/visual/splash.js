import React from 'react'
import styled, { css } from 'styled-components'
import { aqua } from '@quarterto/colours'
import { compose } from 'recompact'
import connectSplashImage from '../data/splash'
import { withCampaignData } from '../data/campaign'
import { withOwnerData } from '../data/owner'
import select from '../utils/select'
import { Bleed } from './grid'

const splashBackground = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;

	${({ url }) => url && css`
		background-image: linear-gradient(
			rgba(0, 20, 40, 0) 30%,
			rgba(0, 20, 40, 0.9)
		), url(${url});
	`}

	background-color: ${({ color }) => color};

	${({ url2x }) =>
		url2x &&
		css`
			@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
				background-image: linear-gradient(
						rgba(0, 20, 40, 0) 30%,
						rgba(0, 20, 40, 0.9)
					),
					url(${url2x});
			}
		`}

	background-size: cover;
	background-position: center;
`

export const SplashBackground = styled.div`
	${splashBackground}
`

export const SplashBleed = Bleed.extend`
	${splashBackground}

	width: 100vw;
	height: ${select({
	large: '60vw',
	small: '30vw',
	default: '40vw'
})};

	max-height: ${select({
	large: '60vh',
	small: '30vh',
	default: '40vh'
})};
`

export const Hero = styled.div`
	margin-top: auto;
	color: white;

	a:link,
	a:visited {
		color: inherit;
		font-weight: bold;
	}

	a:hover {
		color: ${aqua[5]};
	}

	a:active {
		color: ${aqua[4]};
	}
`

export const HeroTitle = styled.h2`
	font-family: 'Libre Baskerville', serif;
	font-weight: normal;
	text-align: center;

	font-size: 1.4em;
	margin: 0 0 0.5rem;

	${SplashBleed} & {
		@media (min-width: 25em) {
			font-size: 2em;
			margin-bottom: 1rem;
		}

		@media (min-width: 40em) {
			font-size: 2.4em;
			margin-bottom: 2rem;
		}
	}
`

export const HeroSubtitle = styled.h3`
	font-family: 'Libre Baskerville', serif;
	font-weight: normal;
	text-align: center;
	font-variant: small-caps;
	margin: 0 0 0.5rem;

	${SplashBleed} & {
		@media (min-width: 25em) {
			font-size: 1.2em;
		}

		@media (min-width: 40em) {
			font-size: 1.4em;
		}
	}
`

export const HeroBlurb = styled.p`
	line-height: 1.6;
	font-family: 'Libre Baskerville', serif;
	text-align: center;
	padding: 0 1em;
	margin: 0 0 1em;
	font-size: 0.8em;

	${SplashBleed} & {
		@media (min-width: 25em) {
			font-size: 1em;
		}

		@media (min-width: 40em) {
			font-size: 1.2em;
		}
	}
`

const connectCampaignSplash = compose(
	withCampaignData,
	connectSplashImage,
	withOwnerData('campaign')
)

export const CampaignSplash = connectCampaignSplash(
	({ campaign, noBlurb, ownerUser, children, ...props }) => (
		<SplashBleed {...props}>
			<Hero>
				{children}
				<HeroTitle>{campaign.title}</HeroTitle>
				{!noBlurb && (campaign.tagline || ownerUser) && (
					<HeroBlurb>
						{campaign.tagline || `A campaign by ${ownerUser.username}`}
					</HeroBlurb>
				)}
			</Hero>
		</SplashBleed>
	)
)
