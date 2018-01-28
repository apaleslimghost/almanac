import React from 'react';
import styled, {css, injectGlobal} from 'styled-components';
import * as blocks from '../blocks';
import {withTracker} from 'meteor/react-meteor-data';
import {default as GridLayout, WidthProvider} from 'react-grid-layout';
import {Layout} from './../../shared/collections';
import {withState} from 'recompose';
import {withCampaign} from './collection/campaign';
import {compose} from 'recompose';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

injectGlobal`
	.react-grid-item {
		overflow: auto;
	}

	.grid-control .react-grid-item {
		border: 1px solid #e9e1da;
		background: #f9f1ea;
	}

	.react-grid-item.react-grid-placeholder {
		background: teal;
	}

	.react-resizable-handle {
		z-index: 100;
	}
`;

const GridLayoutWidth = WidthProvider(GridLayout);

const connectSelect = withState(
	'selected',
	'select',
	''
);

const ComponentSelect = connectSelect(({onSelect, select, selected}) => <div>
	<select
		value={selected}
		onChange={ev => select(ev.target.selectedOptions[0].value)}
	>
		<option value="" disabled>
			Component&hellip;
		</option>
		{Object.keys(blocks)
			.map(component => (
				<option value={component} key={component}>
					{component}
				</option>
			))}
	</select>
	<button
		onClick={() => {
			onSelect(selected);
			select('');
		}}
		disabled={!selected}
	>
		+
	</button>
</div>);

const CloseButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1000;
`;

const withLayoutData = withTracker(({campaignId}) => ({
	layout: Layout.find({campaignId}).fetch(),

	updateLayout(layout) {
		layout.forEach(({i, ...item}) => {
			Layout.update(i, {$set: item});
		});
	},

	addComponent(component) {
		Layout.insert({component, x: 0, y: 0, w: 2, h: 1, campaignId});
	},

	removeComponent(_id) {
		Layout.remove(_id);
	}
}));

const connectLayout = compose(withCampaign, withLayoutData);

export default connectLayout(({
	which,
	layout,
	updateLayout,
	addComponent,
	removeComponent,
	...props
}) => <div className={`grid-${which}`}>
	{which === 'control' && <ComponentSelect onSelect={addComponent} />}
	<GridLayoutWidth
		layout={layout.map(({_id, ...item}) => ({i:_id, ...item}))}
		onLayoutChange={updateLayout}
		isDraggable={which === 'control'}
		isResizable={which === 'control'}
		rowHeight={60}
		draggableCancel='input, button, select'
	>
		{layout.map(({_id, component}) => <div key={_id}>
			{which === 'control' &&
				<CloseButton onClick={() => removeComponent(_id)}>×</CloseButton>}
			{blocks[component]
				? React.createElement(blocks[component][which], props)
				: 'unknown component'}
		</div>)}
	</GridLayoutWidth>
</div>);
