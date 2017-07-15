import React from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {injectGlobal} from 'styled-components';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';

import CardList from './card-list';
import {EditTypes} from './link-type';

injectGlobal`
	* { box-sizing: border-box; }

	body {
		margin: 0;
		font-family: system-ui;
		color: ${steel[0]};
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

//TODO: card search
//TODO: card filtering by link type
//TODO: integrate Menagerie (monsters & spells, with JSON import/export)

const App = () => <div>
	<EditTypes />
	<CardList />
</div>

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});
