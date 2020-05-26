import React from 'react'
import {
	Space,
	NavArea,
	SplashToolbar,
	Toolbar,
	Divider,
	MenuLink,
} from '../imports/ui/visual/menu'

export default {
	title: 'Menu',
}

export const menu = () => (
	<Toolbar>
		<NavArea>
			<MenuLink href='#'>Some</MenuLink>
			<MenuLink href='#'>Menu</MenuLink>
			<MenuLink href='#'>Links</MenuLink>

			<Divider />

			<MenuLink href='#'>More</MenuLink>

			<Space />

			<MenuLink href='#'>Right</MenuLink>
		</NavArea>
	</Toolbar>
)
