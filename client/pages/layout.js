import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import { CampaignContext, useCampaignData } from '../data/campaign'
import Icon from '../visual/icon'
import { H3 } from '../visual/heading'
import { logout, useUser } from '../utils/logged-in'
import Logo from '../visual/logo'
import Grid from '../visual/grid'
import Title from '../utils/title'
import User from '../document/user'
import { useAmOwner } from '../data/owner'
import { Toolbar, MenuLink, Divider, NavArea, Space } from '../visual/menu'

import 'react-toastify/dist/ReactToastify.min.css'

const LogoutButton = ({ user }) => (
	<User user={user} component={MenuLink} href='/logout' onClick={logout} />
)

const MenuTitle = styled(H3)`
	display: inline-block;
	margin: 0;
	align-self: center;
	white-space: nowrap;
`

const MenuLogo = styled(Logo)`
	margin: -0.3rem 0;
`

const CampaignTitle = ({ campaign }) => (
	<MenuLink href={`/${campaign._id}`}>
		<MenuTitle>{campaign.title}</MenuTitle>
	</MenuLink>
)

const Nav = ({ campaignId, extraItems }) => {
	const { campaign } = useCampaignData({ campaignId })
	const isOwner = useAmOwner(campaign)
	const user = useUser()

	return (
		<Toolbar>
			<NavArea>
				<MenuLink href='/'>
					<MenuLogo />
				</MenuLink>

				{campaign && (
					<>
						<Divider />
						<CampaignTitle campaign={campaign} />

						{user &&
							(isOwner ? (
								<>
									<MenuLink href={`/${campaign._id}/dashboard-control`}>
										<Icon icon='wooden-sign' />
										Dashboard
									</MenuLink>

									<MenuLink href={`/${campaign._id}/players`}>
										<Icon icon='double-team' />
										Players
									</MenuLink>

									<MenuLink href={`/${campaign._id}/settings`}>
										<Icon icon='gears' />
										Settings
									</MenuLink>
								</>
							) : (
								<MenuLink href={`/${campaign._id}/dashboard`}>
									<Icon icon='wooden-sign' />
									Dashboard
								</MenuLink>
							))}
					</>
				)}
			</NavArea>

			<NavArea>
				<Space />
				{extraItems}
				{user && <LogoutButton user={user} />}
			</NavArea>
		</Toolbar>
	)
}

const NavContext = createContext({
	setExtraNavItems() {},
	setNavShown() {},
})

export const useHidesNav = hide => {
	const { setNavShown } = useContext(NavContext)

	useEffect(() => {
		setNavShown(hide)
		return () => setNavShown(true)
	})
}

export const useExtraNavItems = (...navItems) => {
	const { setExtraNavItems } = useContext(NavContext)

	useEffect(() => {
		setExtraNavItems(...navItems)

		return () => setExtraNavItems()
	})
}

const Layout = ({ campaignId, secret, children }) => {
	const { campaign, ready } = useCampaignData({ campaignId, secret })
	const [extraItems, setExtraNavItems] = useState([])
	const [navShown, setNavShown] = useState(true)

	return (
		<NavContext.Provider value={{ setExtraNavItems, setNavShown }}>
			<CampaignContext.Provider value={campaign}>
				<Title />
				<ToastContainer autoClose={10000} />
				{navShown && <Nav extraItems={extraItems} />}
				<Grid>{ready ? children : 'loading...'}</Grid>
			</CampaignContext.Provider>
		</NavContext.Provider>
	)
}

export default Layout
