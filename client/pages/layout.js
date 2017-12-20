import React, {Component} from 'react';
import App from './app';
import {withCampaign} from '../components/campaign';
import Icon from '../components/icon';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import Link from '../components/link';

const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0,0,0,0.1);
`;

export const MenuLink = styled(Link)`
	display: block;
	padding: 1em;
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

const Nav = withCampaign(({campaignId, extraItems}) => <Toolbar>
	<MenuLink href={`/`}>
		<Icon icon='circle-of-circles' />
		Campaigns
	</MenuLink>

	<Divider />

	<MenuLink href={`/${campaignId}`}>
		<Icon icon='spades-card' />
		Cards
	</MenuLink>

	<MenuLink href={`/${campaignId}/dashboard-control`}>
		<Icon icon='wooden-sign' />
		Dashboard
	</MenuLink>

	<Space />

	{extraItems}
</Toolbar>);

class Layout extends Component {
	static childContextTypes = {
		setNavItems: PropTypes.func,
	};

	state = {
		extraItems: [],
	};

	getChildContext() {
		return {
			setNavItems: (...extraItems) => {
				this.setState({extraItems});
			}
		}
	}

	render() {
		return <App campaignId={this.props.campaignId}>
			<Nav extraItems={this.state.extraItems} />
			{this.props.children}
		</App>;
	}
}

export default Layout;
