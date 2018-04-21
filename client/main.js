import React from 'react';
import {mount} from 'react-mounter';
import Layout, {Basic as BasicLayout} from './pages/layout';
import App from './app';

import 'formdata-polyfill';

import './visual/global';

import Dashboard from './pages/dashboard';
import Control from './pages/control';
import Grail from './pages/grail';
import Home from './pages/home';
import Login from './pages/login';
import GetStarted from './pages/get-started';
import Campaign from './pages/campaign';

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

		'/:campaignId/cards' ({campaignId}) {
			return <Layout campaignId={campaignId}>
				<Grail />
			</Layout>;
		},

		'/:campaignId' ({campaignId}) {
			if(!campaignId) return false;

			return <Layout campaignId={campaignId}>
				<Campaign />
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

		'/' () {
			return <Layout>
				<Home />
			</Layout>;
		},
	}
});
