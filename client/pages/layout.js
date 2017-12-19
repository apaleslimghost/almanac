import React from 'react';
import App from './app';
import {withCampaign} from '../components/campaign';

const Nav = withCampaign(({campaignId}) => <nav>
	<a href={`/`}>Campaigns</a>
	<a href={`/${campaignId}`}>Cards</a>
	<a href={`/${campaignId}/dashboard`}>Dashboard</a>
	<a href={`/${campaignId}/dashboard-control`}>Dashboard Control</a>
</nav>);

const Layout = ({children, campaignId}) => <App campaignId={campaignId}>
	<Nav />
	{children}
</App>;

export default Layout;
