import React from 'react';
import {injectGlobal} from 'styled-components'
import {background} from '../src/colors';
import {route} from '../src/router';
import {mount} from 'react-mounter';

const App = ({content}) => <main>
	{content}
</main>

import Home from './home';
import Control from './control';

injectGlobal`
body {
	font-family: Bookmania;
	line-height: 1.6;
	font-size: 24px;
	margin: 0;
	overflow: hidden;
	background: ${background};
}

* {
	box-sizing: border-box;
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
