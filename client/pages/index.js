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

import Dashboard from './dashboard';
import Control from './control';
import Grail from './grail';

//TODO: card search
//TODO: integrate Menagerie (monsters & spells, with JSON import/export)
//TODO: sidebar
//TODO: time and location as a first class concept
//TODO: reinstate metadata
//TODO: search by metadata

injectGlobal`
	body {
		font-family: Bookmania;
		line-height: 1.6;
		font-size: 24px;
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

route('/:campaignId/dashboard', {
	name: 'Dashboard',
	action({campaignId}) {
		mount(App, {
			content: <Dashboard campaignId={campaignId} />
		});
	}
});

route('/:campaignId/dashboard-control', {
	name: 'Control',
	action({campaignId}) {
		mount(App, {
			content: <Control campaignId={campaignId} />
		});
	}
});

route('/:campaignId', {
	name: 'Grail',
	action({campaignId}) {
		mount(App, {
			content: <Grail campaignId={campaignId} />
		});
	}
});

route('/', {
	name: 'Home',
	action() {
		mount(App, {
			content: <h1>Almanac</h1>
		});
	}
})
