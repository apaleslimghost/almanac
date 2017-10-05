import React from 'react';
import {injectGlobal} from 'styled-components'
import {background} from '../src/colors';
import {route} from '../src/router';
import {mount} from 'react-mounter';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';

const App = ({content}) => <main>
	{content}
</main>;

import Home from './home';
import Control from './control';

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

route('/', {
	name: 'Home',
	action() {
		mount(App, {
			content: <Home />
		});
	}
});

route('/control', {
	name: 'Control',
	action() {
		mount(App, {
			content: <Control />
		});
	}
});
