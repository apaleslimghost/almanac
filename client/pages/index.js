import React from 'react';
import {injectGlobal} from 'styled-components'
import {background} from '../colors';
import {route} from '../router';
import {mount} from 'react-mounter';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';

const App = ({content}) => <main>
	{content}
</main>;

import Home from './home';
import Control from './control';
import Grail from './grail';

//TODO: card search
//TODO: integrate Menagerie (monsters & spells, with JSON import/export)
//TODO: sidebar
//TODO: time and location as a first class concept
//TODO: reinstate metadata
//TODO: search by metadata

injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,700,700i|Libre+Baskerville');

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

	a, a:visited {
		color: ${sky[3]};
		text-decoration-skip: ink;
	}

	a:hover {
		color: ${sky[4]};
	}

	a:active {
		color: ${sky[2]};
	}
`;

route('/dashboard', {
	name: 'Home',
	action() {
		mount(App, {
			content: <Home />
		});
	}
});

route('/dashboard-control', {
	name: 'Control',
	action() {
		mount(App, {
			content: <Control />
		});
	}
});

route('/', {
	name: 'Grail',
	action() {
		mount(App, {
			content: <Grail />
		});
	}
});
