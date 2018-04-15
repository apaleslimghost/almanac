import React, {Component} from 'react';
import {setsCampaign, withCampaign} from '../data/campaign';
import Icon from '../visual/icon';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import Link from '../control/link';
import {withTracker} from 'meteor/react-meteor-data';
import {H3} from '../visual/heading';
import {Campaigns} from '../../shared/collections';
import {compose, withContext, withState, lifecycle, getContext} from 'recompact';
import {withUserData, logout} from '../utils/logged-in';
import Logo from '../visual/logo';

const LogoutButton = withUserData(({user}) => user
	? <MenuLink onClick={logout} href='/logout'>
		<Icon icon='key' />
		{user.emails[0].address}
	</MenuLink>
	: null
);

const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0,0,0,0.1);
`;

export const MenuLink = styled(Link)`
	display: block;
	padding: 1rem;
	color: black;
	text-decoration: none;

	.ra {
		margin-right: 0.25em;
		vertical-align: -1px;
	}

	&:hover {
		background: rgba(0,0,0,0.05);
	}

	&:active {
		background: rgba(0,0,0,0.1);
	}
`;

const Divider = styled.div`
	padding: 0.5em 0;

	&::after {
		display: block;
		content: '';
		width: 1px;
		height: 100%;
		background: rgba(0,0,0,0.1);
	}
`;

const Space = styled.div`
	flex: 1;
`;

const NavArea = styled.div`
	flex: 1;
	display: flex;
`;

const MenuTitle = styled(H3)`
	display: inline-block;
	margin: 0;
	padding: 1rem;
	vertical-align: -1px;
`;

const withCampaignTitle = withTracker(
	({campaignId}) => Campaigns.findOne(campaignId) || {},
);

const connectCampaignTitle = compose(withCampaign, withCampaignTitle);

const CampaignTitle = connectCampaignTitle(
	({title}) => title ? <MenuTitle>{title}</MenuTitle> : null
);

const Nav = withCampaign(({campaignId, extraItems}) => <Toolbar>
	<NavArea>
		<MenuLink href={`/`}>
			<Icon icon='circle-of-circles' />
			Campaigns
		</MenuLink>

		{campaignId && [
			<Divider key={1} />,

			<CampaignTitle key={1.5} />,

			<MenuLink key={2} href={`/${campaignId}`}>
				<Icon icon='spades-card' />
				Cards
			</MenuLink>,

			<MenuLink key={3} href={`/${campaignId}/dashboard-control`}>
				<Icon icon='wooden-sign' />
				Dashboard
			</MenuLink>,
		]}
	</NavArea>

	<Logo />

	<NavArea>
		<Space />
		{extraItems}
		<LogoutButton />
	</NavArea>
</Toolbar>);

const navContext = {
	setExtraNavItems: PropTypes.func,
	setNavShown: PropTypes.func,
};

export const withNavContext = getContext(navContext);

const navState = withState('state', 'setState', {
	extraItems: [],
	navShown: true,
});

const setNavContext = withContext(
	navContext,
	({setState, state}) => ({
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
	})
);

export const hidesNav = compose(
	withNavContext,
	lifecycle({
		componentDidMount() {
			this.props.setNavShown(false);
		},

		componentWillUnmount() {
			this.props.setNavShown(true);
		},
	})
);

const connectLayout = compose(
	navState,
	setNavContext
);

export const Basic = setsCampaign(({children}) => <div>
	{children}
</div>);

const Layout = connectLayout(({campaignId, state, children}) =>
	<Basic campaignId={campaignId}>
		{state.navShown &&
			<Nav extraItems={state.extraItems} />
		}

		{children}
	</Basic>
);

export default Layout;
