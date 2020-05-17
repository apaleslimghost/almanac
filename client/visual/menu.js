import React from 'react'
import styled from 'styled-components'
import { Link } from 'use-history'
import { colourTransitions, BackgroundButton } from './primitives'
import composeStyles from '@quarterto/styled-compose'

export const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

export const MenuItem = styled.div`
	display: flex;
	padding: ${({ flush }) => (flush ? '.75rem 1rem' : '1rem')};
	color: black;
	text-decoration: none;

	.ra,
	.fa {
		margin-right: 0.25em;
		align-self: center;
	}
`

const InteractiveMenuItem = styled(MenuItem)`
	${colourTransitions}

	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	&:active {
		background: rgba(0, 0, 0, 0.1);
	}
`

export const MenuLink = props => <InteractiveMenuItem as={Link} {...props} />
export const MenuButton = composeStyles(BackgroundButton, InteractiveMenuItem)

export const Divider = styled.div`
	padding: 0.5em 0;

	&::after {
		display: block;
		content: '';
		width: 1px;
		height: 100%;
		background: rgba(0, 0, 0, 0.1);
	}
`

export const Space = styled.div`
	flex: 1;
`

export const NavArea = styled.div`
	flex: 1;
	display: flex;
`

export const Center = styled.div`
	display: flex;
	max-width: 84rem; /* TODO derive this from grid */
	width: 100%;
	margin: 0 auto;
`

export const SplashToolbar = styled(Toolbar)`
	margin-top: -1rem;
	grid-column: bleed;
`
