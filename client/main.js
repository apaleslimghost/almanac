import React from 'react';
import {mount} from 'react-mounter';
import Layout, {Basic as BasicLayout} from './pages/layout';
import App from './app';

import 'formdata-polyfill';

import './visual/global';

import Dashboard from './pages/dashboard';
import Control from './pages/control';
import Home from './pages/home';
import Login from './pages/login';
import GetStarted from './pages/get-started';
import Campaign from './pages/campaign';
import CampaignSettings from './pages/campaign-settings';
import CampaignPlayers from './pages/campaign-players';
import NewCampaign from './pages/new-campaign';
import Verify from './pages/verify';

mount(App, {
	routes: {
		'/:campaignId/dashboard' ({campaignId}) {
			return <BasicLayout campaignId={campaignId}>
				<Dashboard />
			</BasicLayout>;
		},

		'/:campaignId/dashboard-control' ({campaignId}) {
			return <Layout campaignId={campaignId}>
				<Control />
			</Layout>;
		},

		'/:campaignId/cards/:cardId' ({campaignId, cardId}) {
			return <Layout campaignId={campaignId}>
				<Grail selectCard={cardId} />
			</Layout>;
		},

		'/:campaignId/settings' ({campaignId}) {
			return <Layout campaignId={campaignId}>
				<CampaignSettings />
			</Layout>;
		},

		'/:campaignId/players' ({campaignId}) {
			return <Layout campaignId={campaignId}>
				<CampaignPlayers />
			</Layout>;
		},

		'/:campaignId' ({campaignId}) {
			if(!campaignId) return false;

			return <Layout campaignId={campaignId}>
				<Campaign />
			</Layout>;
		},

		'/new-campaign' (params) {
			return <Layout>
				<NewCampaign />
			</Layout>;
		},

		'/get-started' (params, {title}) {
			return <Layout>
				<GetStarted title={title} />
			</Layout>;
		},

		'/login' () {
			return <Layout>
				<Login />
			</Layout>;
		},

		'/verify/:token' ({token}) {
			return <Layout>
				<Verify token={token} />
			</Layout>;
		},

		'/' () {
			return <Layout>
				<Home />
			</Layout>;
		},
	}
});
