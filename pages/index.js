import styleSheet from 'styled-components/lib/models/StyleSheet';
import {injectGlobal} from 'styled-components'
import {background} from '../src/colors';
import {FlowRouter} from 'meteor/kadira:flow-router';

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

console.log(FlowRouter);
