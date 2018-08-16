import styled, {css} from 'styled-components';
import {aqua} from '@quarterto/colours';
import {Bleed} from '../visual/grid';

const splashBackground = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;

	background-image:
		linear-gradient(rgba(0, 20, 40, 0) 30%, rgba(0, 20, 40, 0.9)),
		url(${({url}) => url});

	background-color: ${({color}) => color};

	${({url2x}) => url2x && css`@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		background-image:
			linear-gradient(rgba(0, 20, 40, 0) 30%, rgba(0, 20, 40, 0.9)),
			url(${url2x});
	}`}

	background-size: cover;
	background-position: center;
`;

export const SplashBackground = styled.div`${splashBackground}`;

export const SplashBleed = Bleed.extend`
	${splashBackground}

	width: 100vw;
	height: ${({large}) => large ? '60vw' : '40vw'};
	max-height: ${({large}) => large ? '60vh' : '40vh'};
`;

export const Hero = styled.div`
	margin-top: auto;
	color: white;

	a:link, a:visited {
		color: inherit;
		font-weight: bold;
	}

	a:hover {
		color: ${aqua[5]};
	}

	a:active {
		color: ${aqua[4]};
	}
`;

export const HeroTitle = styled.h2`
	font-family: 'Libre Baskerville', serif;
	font-weight: normal;
	text-align: center;

	font-size: 1.4em;
	margin-bottom: 0.5rem;

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
`;

export const HeroBlurb = styled.p`
	line-height: 1.6;
	font-family: 'Libre Baskerville', serif;
	text-align: center;
	padding: 0 1em;
	margin: 0 0 1em;
	font-size: .8em;

	${SplashBleed} & {
		@media (min-width: 25em) {
			font-size: 1em;
		}

		@media (min-width: 40em) {
			font-size: 1.2em;
		}
	}
`;
