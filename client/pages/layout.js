import React from 'react';
import App from './app';
import {withCampaign} from '../components/campaign';
import Icon from '../components/icon';
import styled, {css} from 'styled-components';

const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0,0,0,0.1);
`;

const Link = styled.a`
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

const launchDashboard = campaignId => () => {
	// don't preventdefault, because the link itself is opening the controls
	window.open(`/${campaignId}/dashboard`, `${campaignId} dashboard`);
};

const Nav = withCampaign(({campaignId}) => <Toolbar>
	<Link href={`/`}>
		<Icon icon='circle-of-circles' />
		Campaigns
	</Link>

	<Divider />

	<Link href={`/${campaignId}`}>
		<Icon icon='spades-card' />
		Cards
	</Link>

	<Link href={`/${campaignId}/dashboard-control`} onClick={launchDashboard(campaignId)}>
		<Icon icon='wooden-sign' />
		Launch Dashboard
	</Link>
</Toolbar>);

const Layout = ({children, campaignId}) => <App campaignId={campaignId}>
	<Nav />
	{children}
</App>;

export default Layout;
