import React from 'react';
import map from 'lodash.map';
import styled, {css} from 'styled-components';
import {observe} from './store';
import * as components from './components';
import LayoutControl from './components/layout-control';

const Split = styled.div`
display: flex;
flex-direction: ${({direction}) => direction};
flex: 1;
&:not(:last-child) {
	border-${({direction}) => direction === 'row' ? 'bottom' : 'right'}: 1px solid #ccc;
}
`;

const GridChild = styled.div`
flex: ${({flex = 1}) => flex};
padding: 1em;
max-height: 100vh;
max-width: 100vw;
overflow: auto;
&:not(:last-child) {
	border-${({direction}) => direction === 'row' ? 'right' : 'bottom'}: 1px solid #ccc;
}
`;

const Grid = ({layout, direction = 'row', keys = [], which}) =>
	<Split direction={direction}>
		{layout.map((child, i) => Array.isArray(child) ?
			<Grid key={keys.concat(i).join('.')} keys={keys.concat(i)} layout={child} direction={direction === 'row' ? 'column': 'row'} which={which} />
			: <GridChild key={keys.concat(i).join('.')} direction={direction} {...child}>
				{which === 'control' && <LayoutControl location={keys.concat(i)} direction={direction} />}
				{child.component ?
					React.createElement(components[child.component][which], Object.assign({location: keys.concat(i)}, child))
				: React.createElement(components[child][which], {location: keys.concat(i)})}
			</GridChild>
		)}
	</Split>;

export default observe(({which}, {subscribe}) => <Grid layout={subscribe('layout', [])} which={which} />);
