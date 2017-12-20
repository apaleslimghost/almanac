import React from 'react';
import {injectGlobal} from 'styled-components'
import {background} from '../colors';
import route from '../router';
import {mount} from 'react-mounter';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';
import App from './app';
import Layout from './layout';
import {setsCampaign} from '../components/campaign';
import 'formdata-polyfill';

import url from 'url';

import Dashboard from './dashboard';
import Control from './control';
import Grail from './grail';
import Home from './home';

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

	'/:campaignId' ({campaignId}) {
		mount(Layout, {
			campaignId,
			children: <Grail />
		});
	},

	'/' () {
		console.log('here');
		mount(App, {
			children: <Home />
		});
	},
});
