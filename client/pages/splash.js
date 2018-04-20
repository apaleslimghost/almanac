import React from 'react';
import styled from 'styled-components';
import Link from '../control/link';
import {go} from '../utils/router';
import {hidesNav} from './layout';
import Logo from '../visual/logo';
import {Button, Input} from '../visual/primitives';
import {aqua} from '@quarterto/colours';
import generateCampaign from '@quarterto/campaign-name-generator';
import {H3} from '../visual/heading';

const formHeight = '160px';

const SplashBackground = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;

	width: 100vw;
	height: 60vw;
	max-height: 60vh;

	margin-bottom: ${formHeight};

	@media (min-width: 640px) {
		margin-bottom: 0;
	}

	background-size: cover;
	background-position: center;

	background-image:
		linear-gradient(rgba(0, 20, 40, 0) 30%, rgba(0, 20, 40, 0.9)),
		url(/images/splash.jpg);

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		background-image:
			linear-gradient(rgba(0, 20, 40, 0) 30%, rgba(0, 20, 40, 0.9)),
			url(/images/splash@2x.jpg);
	}
`;

const SplashLogo = styled(Logo)`
	height: 1.4em;

	@media (min-width: 400px) {
		height: 2em;
	}

	@media (min-width: 640px) {
		height: 3em;
	}
`;

const Hero = styled.div`
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

const HeroTitle = styled.h2`
	font-family: 'Libre Baskerville', serif;
	font-weight: normal;
	text-align: center;

	font-size: 1.4em;
	margin-bottom: 0.5rem;

	@media (min-width: 400px) {
		font-size: 2em;
		margin-bottom: 1rem;
	}

	@media (min-width: 640px) {
		font-size: 2.4em;
		margin-bottom: 2rem;
	}
`;

const HeroBlurb = styled.p`
	line-height: 1.6;
	font-family: 'Libre Baskerville', serif;
	text-align: center;
	padding: 0 1em;
	margin: 0 0 1em;
	font-size: .8em;

	@media (min-width: 400px) {
		font-size: 1em;
	}

	@media (min-width: 640px) {
		font-size: 1.2em;
		text-align: right;
		margin-right: 1em;
		margin-bottom: 0;
		padding-right: 1em;
		border-right: 1px solid white;
	}
`;

const Split = styled.div`
	display: flex;
	justify-content: center;
	align-items: stretch;
	margin: 0 auto 1em;
	flex-direction: column;

	@media (min-width: 640px) {
		width: 640px;
		align-items: center;
		margin-top: 0;
		flex-direction: row;
	}
`;

const SplashForm = styled.form`
	background: #102535;
	padding: 1em;
	height: ${formHeight};
	margin-bottom: -${formHeight};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	@media (min-width: 640px) {
		height: auto;
		margin-bottom: 0;
		padding: 0 1em 0 0;
		align-items: flex-start;
		background: none;
	}
`;

const CTA = Button.extend`
	padding: 0.4em;
	margin-top: 0.4em;
	margin-right: 0.4em;
	font-size: 1.1em;
`;

const startCreateFlow = ev => {
	ev.preventDefault();
	const {title} = formJson(ev.target);
	go(ev.target.action, {title});
};

const Splash = hidesNav(() => <SplashBackground>
	<SplashLogo />
	<Hero>
		<HeroTitle>The sandbox RPG app.</HeroTitle>

		<Split>
			<HeroBlurb>Everything you need to run a sandbox tabletop RPG & get your players involved in your world.</HeroBlurb>
			<SplashForm action='/get-started' onSubmit={startCreateFlow}>
				<H3>Start your campaign</H3>
				<Input name='title' size={30} placeholder={generateCampaign()} required />
				<div>
					<CTA>Get started</CTA> or, <Link href='/login'>log in</Link>.
				</div>
			</SplashForm>
		</Split>
	</Hero>
</SplashBackground>);

export default Splash;
