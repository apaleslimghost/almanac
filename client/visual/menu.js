import styled from 'styled-components'
import Link from '../control/link'

export const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

export const MenuItem = styled.div`
	display: block;
	padding: 1rem;
	color: black;
	text-decoration: none;

	.ra,
	.fa {
		margin-right: 0.25em;
		vertical-align: -1px;
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
export const MenuButton = InteractiveMenuItem.withComponent('button')

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
	max-width: 64rem;
	width: 100%;
	margin: 0 auto;
`
