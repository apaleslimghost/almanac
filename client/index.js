import React from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {injectGlobal} from 'styled-components';
import {steel, sky} from '@quarterto/colours';

import CardList from './card-list';

injectGlobal`
	* { box-sizing: border-box; }

	body {
		margin: 0;
		font-family: system-ui;
		color: ${steel[0]};
	}

	a, a:visited {
		color: ${sky[3]};
	}

	a:hover {
		color: ${sky[4]};
	}

	a:active {
		color: ${sky[2]};
	}
`;

Meteor.startup(() => {
	render(<CardList />, document.querySelector('main'));
});
