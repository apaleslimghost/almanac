import React from 'react';
import styled from 'styled-components';
import Link from '../control/link';
import {go} from '../utils/router';
import {hidesNav} from './layout';
import Logo from '../visual/logo';
import {Button, Input} from '../visual/primitives';
import generateCampaign from '@quarterto/campaign-name-generator';
import {H3} from '../visual/heading';
import {SplashBackground, Hero, HeroTitle, HeroBlurb} from '../visual/splash';
import formJson from '@quarterto/form-json';
import url from 'url';

const formHeight = '160px';

const SplashWithForm = SplashBackground.extend`
	margin-bottom: ${formHeight};

	@media (min-width: 640px) {
		margin-bottom: 0;
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

const SplitBlurb = HeroBlurb.extend`
	@media (min-width: 640px) {
		text-align: right;
		margin-right: 1em;
		margin-bottom: 0;
		padding-right: 1em;
		border-right: 1px solid white;
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
	const {pathname} = url.parse(ev.target.action);

	go(pathname, {title});
};

const Splash = hidesNav(() => <SplashWithForm large url='/images/splash.jpg' url2x='/images/splash@2x.jpg' color='#BEBDA0'>
	<SplashLogo />
	<Hero>
		<HeroTitle>The sandbox RPG app.</HeroTitle>

		<Split>
			<SplitBlurb>Everything you need to run a sandbox tabletop RPG & get your players involved in your world.</SplitBlurb>
			<SplashForm action='/get-started' onSubmit={startCreateFlow}>
				<H3>Start your campaign</H3>
				<Input name='title' size={30} placeholder={generateCampaign()} required />
				<div>
					<CTA>Get started</CTA> or, <Link href='/login'>log in</Link>.
				</div>
			</SplashForm>
		</Split>
	</Hero>
</SplashWithForm>);

export default Splash;
