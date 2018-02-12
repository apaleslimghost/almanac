import React from 'react';
import {injectGlobal} from 'styled-components'
import {background} from './utils/colors';
import route from './utils/router';
import {mount} from 'react-mounter';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';
import App from './pages/app';
import Layout from './pages/layout';
import {setsCampaign} from './data/campaign';
import 'formdata-polyfill';

import url from 'url';

import Dashboard from './pages/dashboard';
import Control from './pages/control';
import Grail from './pages/grail';
import Home from './pages/home';

//TODO: card search
//TODO: integrate Menagerie (monsters & spells, with JSON import/export)
//TODO: sidebar
//TODO: time and location as a first class concept
//TODO: reinstate metadata
//TODO: search by metadata

const buildGoogleFontsUrl = fonts => url.format({
	protocol: 'https',
	host: 'fonts.googleapis.com',
	pathname: 'css',
	query: {
		family: Object.keys(fonts).map(font =>
			`${font}${fonts[font].length ? `:${fonts[font].join(',')}` : ''}`
		).join('|'),
	},
})

injectGlobal`
	@import url(${buildGoogleFontsUrl({
		'Source Sans Pro': ['400', '400i', '700', '700i'],
		'Libre Baskerville': []
	})});

	@font-face {
		font-family: 'PC Ornaments';
		src: url('/fonts/pc-ornaments.woff2') format('woff2');
	}

	body {
		font-family: 'Source Sans Pro', sans-serif;
		margin: 0;
		background: ${background};
		color: ${steel[0]};
	}

	* {
		box-sizing: border-box;
	}

	:focus {
		outline: 3px solid ${sky[3]};
	}
`;

route({
	'/:campaignId/dashboard' ({campaignId}) {
		mount(App, {
			campaignId,
			children: <Dashboard />
		});
	},

	'/:campaignId/dashboard-control' ({campaignId}) {
		mount(Layout, {
			campaignId,
			children: <Control />
		});
	},

	'/:campaignId/:cardId' ({campaignId, cardId}) {
		mount(Layout, {
			campaignId,
			children: <Grail selectCard={cardId} />
		});
	},

	'/:campaignId' ({campaignId}) {
		mount(Layout, {
			campaignId,
			children: <Grail />
		});
	},

	'/' () {
		mount(Layout, {
			children: <Home />
		});
	},
});
