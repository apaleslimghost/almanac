import React from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {injectGlobal} from 'styled-components';
import {steel, sky} from '@quarterto/colours';
import {rgba} from 'polished';
import {shadow} from './primitives';

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

	/* TODO put these somewhere sensible */
	.Popover-body {
		margin-top: -2px; /* move under the tip triangle */
		border: 1px solid ${steel[3]};
		box-shadow: ${shadow(2)};
		background: white;
		padding: 3px;
		border-radius: 2px;
	}

	.Popover-tip {
		border-bottom: 1px solid white; /* cover the bottom stroke of the triangle */
	}
	.Popover-tipShape {
		stroke: ${steel[3]};
		fill: white;
	}
`;

//TODO: card search
//TODO: card filtering by link type

const App = () => <div>
	<EditTypes />
	<CardList />
</div>

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});
