import React from 'react';
import map from 'lodash.map';
import styled, {css} from 'styled-components';
import {observe} from './store';
import * as components from './components';
import LayoutControl from './components/layout-control';

const Split = styled.div`
display: flex;
flex-direction: ${({direction}) => direction};
`;

const GridChild = styled.div`
${({flex}) => flex && css`flex: ${flex};`}
`;

const Grid = ({layout, direction = 'row', keys = [], which}) => <Split direction={direction}>
	{layout.map((child, i) => Array.isArray(child) ?
		<Grid key={keys.concat(i).join('.')} keys={keys.concat(i)} layout={child} direction={direction === 'row' ? 'column': 'row'} which={which} />
		: <GridChild key={keys.concat(i).join('.')} {...child}>
			{which === 'control' && <LayoutControl component={child.component || child} location={keys.concat(i)} />}
			{child.component ?
				React.createElement(components[child.component][which], child)
			: React.createElement(components[child][which])}
		</GridChild>
	)}
</Split>;

export default observe(({which}, {subscribe}) => <Grid layout={subscribe('layout', [])} which={which} />);