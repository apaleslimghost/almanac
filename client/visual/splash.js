import React from 'react'
import styled, { css } from 'styled-components'
import { aqua, steel } from '@quarterto/colours'
import { compose } from 'recompact'
import contrast from 'contrast'
import connectSplashImage from '../data/splash'
import { withCampaignData } from '../data/campaign'
import { withOwnerData } from '../data/owner'
import select from '../utils/select'
import { Bleed } from './grid'
import qs from 'querystring'

const getSplashUrl = ({ urls }, { _2x = false } = {}) => urls.raw + '&' + qs.stringify(Object.assign(
	{
		fit: 'crop',
		crop: 'entropy',
	},
	_2x
		? {
			q: 20,
			w: 1800,
			h: 600,
		}
		: {
			q: 70,
			w: 900,
			h: 300,
		}
))

const splashBackground = css`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;

	color: ${({ splash, color = '#fff' }) =>
		(splash || contrast(color) === 'dark') ? 'white' : steel[0]};

	${({ splash, url }) =>
		(splash || url) &&
		css`
			background-image: linear-gradient(
				rgba(0, 20, 40, 0) 30%,
				rgba(0, 20, 40, 0.9)
			),
			url(${splash ? getSplashUrl(splash) : url});
		`
	}

	background-color: ${({ splash, color }) => splash ? splash.color : color};

	${({ splash, url2x }) =>
		(splash || url2x) &&
		css`
			@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
				background-image: linear-gradient(
					rgba(0, 20, 40, 0) 30%,
					rgba(0, 20, 40, 0.9)
				),
				url(${splash ? getSplashUrl(splash, { _2x: true }) : url2x});
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
	({ campaign, noBlurb, user, children, splash }) => (
		<SplashBleed splash={splash}>
			<Hero>
				{children}
				<HeroTitle>{campaign.title}</HeroTitle>
				{!noBlurb && (campaign.tagline || user) && (
					<HeroBlurb>
						{campaign.tagline || `A campaign by ${user.username}`}
					</HeroBlurb>
				)}
			</Hero>
		</SplashBleed>
	)
)
