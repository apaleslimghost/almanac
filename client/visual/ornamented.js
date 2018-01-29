import React, {Children} from 'react';
import styled, {css} from 'styled-components';
import {H2} from './heading';
import {background} from '../utils/colors';

export const bordered = css`
position: relative;

&:before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 1px;
	margin-top: -1px;
	background: black;
	z-index: 1;
}

> * {
	position: relative;
	background: ${background};
	z-index: 2;
}
`;

const Ornament = styled.span`
font-family: 'PC Ornaments';
font-variant: normal;
font-size: ${({large}) => large ? '2em' : '1.2em'};

&:first-child {
	padding-left: 0.05em;
	padding-right: 0.1em;
}

&:last-child {
	padding-right: 0.05em;
	padding-left: 0.1em;
}
`;

const Ornamented = styled(H2)`
font-family: 'Libre Baskerville', serif;
font-variant: normal;
margin: 0;

display: flex;
align-items: center;
justify-content: center;

${bordered}
`;

const Centered = styled.div`
text-align: center;
`;

export default ({ornament, children, large = false}) => <Ornamented>
	<Ornament large={large}>{ornament}</Ornament>
	<Centered>{children}</Centered>
	<Ornament large={large}>{ornament.toUpperCase()}</Ornament>
</Ornamented>;
