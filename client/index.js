import React from 'react';
import {render} from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {injectGlobal} from 'styled-components';

import CardList from './card-list';

injectGlobal`
	body {
		margin: 0;
		font-family: system-ui;
	}
`;

Meteor.startup(() => {
	render(<CardList />, document.querySelector('main'));
});
