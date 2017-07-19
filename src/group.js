import React from 'react';
import map from 'lodash.map';
import styled, {css} from 'styled-components';
import {observe} from './store';
import * as components from './components';
import LayoutControl from './components/layout-control';

const Root = styled.div`
height: 100vh;
width: 100vw;
overflow: hidden;
`;

const Split = styled.div`
&:not(:last-child) {
	// resize: ${({direction}) => direction === 'row' ? 'vertical' : 'horizontal'};
}

overflow: hidden;
display: flex;
flex-direction: ${({direction}) => direction};
max-height: 100vh;
max-width: 100vw;
`;

const GridChild = styled.div`
&:not(:last-child) {
	// resize: ${({direction}) => direction === 'row' ? 'horizontal' : 'vertical'};
}
margin: 0.5em;
padding: 0.5em;
max-height: 100vh;
max-width: 100vw;
overflow: auto;
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

export default observe(({which}, {subscribe}) => <Root>
	<Grid layout={subscribe('layout', [])} which={which} />
</Root>);
