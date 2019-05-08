import styled, { css } from 'styled-components'
import colours from '@quarterto/colours'
import { Link } from 'use-history'
import { background, colourTransitions } from './primitives'

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

const InteractiveMenuItem = MenuItem.extend`
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	&:active {
		background: rgba(0, 0, 0, 0.1);
	}
`

export const MenuLink = InteractiveMenuItem.withComponent(Link)
export const MenuButton = InteractiveMenuItem.withComponent('button').extend`
	background: none;
	border: none;
	font: inherit;
	cursor: pointer;
	${colourTransitions}

	${({ colour, shade = 2, primary }) =>
		colour &&
		(primary
			? background({ colour, shade })
			: css`
			color: ${colours[colour][shade]};
			  `)}

	&:hover {
		${({ colour, shade = 2, primary }) =>
			primary && background({ colour, shade: Math.min(6, shade + 1) })}
	}
`

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

export const SplashToolbar = Toolbar.extend`
	margin-top: -1rem;
	grid-column: bleed;
`
