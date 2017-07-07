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

const row = (shade, {onSelect}) => colour =>
<Chip onClick={() => onSelect(colour, shade)} key={`${colour}${shade}`} colour={colour} shade={shade} />

const ColourSelect = ({name}, {state, setState}) => {
	const onSelect = (colour, shade) => {
		setState({
			[name]: {colour, shade},
		});
	};

	return <Swatch>
		{hues.map(row(4, {onSelect}))}
		{hues.map(row(3, {onSelect}))}
	</Swatch>;
}

ColourSelect.contextTypes = fieldLike;

export default ColourSelect;
