import url from 'url'
import React from 'react'
import styled from 'styled-components'
import generateCampaign from '@quarterto/campaign-name-generator'
import formJson from '@quarterto/form-json'
import { Link, navigate as go } from 'use-history'
import Logo from '../visual/logo'
import { Button } from '../visual/primitives'
import { H3 } from '../visual/heading'
import { SplashBleed, Hero, HeroTitle, HeroBlurb } from '../visual/splash'
import { Input } from '../visual/form'
import { hidesNav } from './layout'
import Ribbon from '../visual/ribbon'

const formHeight = '160px'

const SplashWithForm = SplashBleed.extend`
	margin-bottom: ${formHeight};

	@media (min-width: 40em) {
		margin-bottom: 0;
	}
`

const SplashLogo = styled(Logo)`
	height: 1.4em;

	@media (min-width: 25em) {
		height: 2em;
	}

	@media (min-width: 40em) {
		height: 3em;
	}
`

const Split = styled.div`
	display: flex;
	justify-content: center;
	align-items: stretch;
	margin: 0 auto 1em;
	flex-direction: column;

	@media (min-width: 40em) {
		width: 40em;
		align-items: center;
		margin-top: 0;
		flex-direction: row;
	}
`

const SplitBlurb = HeroBlurb.extend`
	@media (min-width: 40em) {
		text-align: right;
		margin-right: 1em;
		margin-bottom: 0;
		padding-right: 1em;
		border-right: 1px solid white;
	}
`

const SplashForm = styled.form`
	background: #102535;
	padding: 1em;
	height: ${formHeight};
	margin-bottom: -${formHeight};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	@media (min-width: 40em) {
		height: auto;
		margin-bottom: 0;
		padding: 0 1em 0 0;
		align-items: flex-start;
		background: none;
	}
`

const CallToAction = Button.extend`
	padding: 0.4em;
	margin-top: 0.4em;
	margin-right: 0.4em;
	font-size: 1.1em;
`

const startCreateFlow = ev => {
	ev.preventDefault()
	const { title } = formJson(ev.target)
	const { pathname } = url.parse(ev.target.action)

	go(pathname, { title })
}

const Splash = hidesNav(() => (
	<SplashWithForm
		large
		url='/images/splash.jpg'
		url2x='/images/splash@2x.jpg'
		color='#BEBDA0'
	>
		<Ribbon
			href='https://github.com/quarterto/almanac/wiki/Almanac-is-in-beta'
			target='_blank'
		>
			Beta
		</Ribbon>
		<SplashLogo />
		<Hero>
			<HeroTitle>The sandbox RPG app.</HeroTitle>

			<Split>
				<SplitBlurb>
					Everything you need to run a sandbox tabletop RPG & get your players
					involved in your world.
				</SplitBlurb>
				<SplashForm action='/get-started' onSubmit={startCreateFlow}>
					<H3>Start your campaign</H3>
					<Input
						required
						name='title'
						size={30}
						placeholder={generateCampaign()}
					/>
					<div>
						<CallToAction>Get started</CallToAction> or,{' '}
						<Link href='/login'>log in</Link>.
					</div>
				</SplashForm>
			</Split>
		</Hero>
	</SplashWithForm>
))

export default Splash
