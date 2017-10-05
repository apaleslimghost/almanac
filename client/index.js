import React from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {injectGlobal} from 'styled-components';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';

import CardList from './card-list';
import Filter from './filter';

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
//TODO: integrate Menagerie (monsters & spells, with JSON import/export)
//TODO: sidebar
//TODO: time and location as a first class concept
//TODO: reinstate metadata
//TODO: search by metadata

const App = () => <div>
	<Filter />
	<CardList />
</div>

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});
