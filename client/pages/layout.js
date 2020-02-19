import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import { CampaignContext, useCampaignData, useCampaign } from '../data/campaign'
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

const Nav = ({ extraNavItem = null }) => {
	const campaign = useCampaign()
	const { amOwner } = useAmOwner(campaign)
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
							(amOwner ? (
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
				{extraNavItem}
				{user && <LogoutButton user={user} />}
			</NavArea>
		</Toolbar>
	)
}

const NavContext = createContext(() => {})

export const useHidesNav = hide => {
	const setNavShown = useContext(NavContext)

	useEffect(() => {
		setNavShown(!hide)
		return () => setNavShown(true)
	})
}

const Layout = ({ campaignId, secret, extraNavItem, children }) => {
	const { campaign, ready } = useCampaignData({ campaignId, secret })
	const [navShown, setNavShown] = useState(true)

	return (
		<NavContext.Provider value={setNavShown}>
			<CampaignContext.Provider value={campaign}>
				<Title />
				<ToastContainer autoClose={10000} />
				{navShown && <Nav extraNavItem={extraNavItem} />}
				<Grid>{ready ? children : 'loading...'}</Grid>
			</CampaignContext.Provider>
		</NavContext.Provider>
	)
}

export default Layout
