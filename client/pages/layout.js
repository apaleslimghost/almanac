import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
	compose,
	withContext,
	withState,
	lifecycle,
	getContext,
} from 'recompact'
import { ToastContainer } from 'react-toastify'
import { setsCampaign, withCampaignData } from '../data/campaign'
import Icon from '../visual/icon'
import { H3 } from '../visual/heading'
import { withUserData, logout } from '../utils/logged-in'
import Logo from '../visual/logo'
import Grid from '../visual/grid'
import Title from '../utils/title'
import User from '../document/user'
import { iAmOwner } from '../data/owner'
import { Toolbar, MenuLink, Divider, NavArea, Space } from '../visual/menu'
import Ribbon from '../visual/ribbon'

import 'react-toastify/dist/ReactToastify.min.css'

const LogoutButton = withUserData(({ user }) =>
	user ? (
		<User user={user} component={MenuLink} href='/logout' onClick={logout} />
	) : null,
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

const connectNav = compose(
	withCampaignData,
	iAmOwner('campaign'),
	withUserData,
)

const Nav = connectNav(({ campaign, isOwner, extraItems }) => (
	<Toolbar>
		<NavArea>
			<MenuLink href='/'>
				<MenuLogo />
			</MenuLink>

			{campaign && (
				<>
					<Divider />
					<CampaignTitle campaign={campaign} />

					{isOwner ? (
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
					)}
				</>
			)}
		</NavArea>

		<NavArea>
			<Space />
			{extraItems}
			<LogoutButton />
		</NavArea>
	</Toolbar>
))

const navContext = {
	setExtraNavItems: PropTypes.func,
	setNavShown: PropTypes.func,
}

export const withNavContext = getContext(navContext)

const navState = withState('state', 'setState', {
	extraItems: [],
	navShown: true,
})

const setNavContext = withContext(navContext, ({ setState, state }) => ({
	setExtraNavItems(...extraItems) {
		setState({
			...state,
			extraItems,
		})
	},

	setNavShown(navShown = true) {
		setState({
			...state,
			navShown,
		})
	},
}))

export const hidesNav = compose(
	withNavContext,
	lifecycle({
		componentDidMount() {
			this.props.setNavShown(false)
		},

		componentWillUnmount() {
			this.props.setNavShown(true)
		},
	}),
)

export const withExtraNavItems = (...navItems) =>
	compose(
		withNavContext,
		lifecycle({
			componentDidMount() {
				this.props.setExtraNavItems(
					...navItems.map(NavItem => (
						<NavItem {...this.props} key={NavItem.name} />
					)),
				)
			},

			componentWillUnmount() {
				this.props.setExtraNavItems()
			},
		}),
	)

const connectLayout = compose(
	navState,
	setNavContext,
	setsCampaign,
)

const BasicLayout = ({ children }) => (
	<>
		<Title />
		<ToastContainer autoClose={10000} />
		{children}
	</>
)

export const Basic = setsCampaign(BasicLayout)

const Layout = connectLayout(({ state, children, ready }) => (
	<BasicLayout>
		<Ribbon
			href='https://github.com/quarterto/almanac/wiki/Almanac-is-in-beta'
			target='_blank'
		>
			Beta
		</Ribbon>
		{state.navShown && <Nav extraItems={state.extraItems} />}

		<Grid>{ready ? children : 'loading...'}</Grid>
	</BasicLayout>
))

export default Layout
