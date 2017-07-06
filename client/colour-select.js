import React from 'react';
import colours from '@quarterto/colours';
import styled from 'styled-components';
import {etched} from './primitives';

import {fieldLike} from './form';

const hues = Object.keys(colours);

const Chip = styled.a`
	${etched}
	width: 1rem;
	height: 1rem;
	border-radius: 1px;
	display: block;
`;

const Swatch = styled.div`
	display: grid;
	grid-template-columns: repeat(${hues.length}, 1rem);
	grid-gap: 2px;
`;

const row = (shade, {onSelect}) => hue =>
<Chip onClick={() => onSelect(hue, shade)} key={`${hue}${shade}`} colour={hue} shade={shade} />

const ColourSelect = ({name}, {state, setState}) => {
	const onSelect = (hue, shade) => {
		setState({
			[name]: colours[hue][shade],
		});
	};

	return <Swatch>
		{hues.map(row(4, {onSelect}))}
		{hues.map(row(3, {onSelect}))}
		{hues.map(row(2, {onSelect}))}
	</Swatch>;
}

ColourSelect.contextTypes = fieldLike;

export default ColourSelect;
