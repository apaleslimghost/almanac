import React from 'react';
import styled, {css} from 'styled-components';
import * as components from './components';
import {createContainer} from 'meteor/react-meteor-data';
import {default as GridLayout, WidthProvider} from 'react-grid-layout';
import {Layout} from './collections';
import withState from './components/state';

const GridLayoutWidth = WidthProvider(GridLayout);

const ComponentSelect = withState(
	{selected: ''},
	({onSelect}, {selected}, setState) => (
		<div>
			<select
				value={selected}
				onChange={ev =>
					setState({selected: ev.target.selectedOptions[0].value})}
			>
				<option value="" disabled>
					Component&hellip;
				</option>
				{Object.keys(components)
					.map(component => (
						<option value={component} key={component}>
							{component}
						</option>
					))}
			</select>
			<button
				onClick={() => {
					onSelect(selected);
					setState({selected: ''});
				}}
				disabled={!selected}
			>
				+
			</button>
		</div>
	)
);

const CloseButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1000;
`;

export default createContainer(
	() => ({
		layout: Layout.find().fetch(),

		updateLayout(layout) {
			layout.forEach(({i, ...item}) => {
				Layout.update(i, {$set: item});
			});
		},

		addComponent(component) {
			Layout.insert({component, x: 0, y: 0, w: 2, h: 1});
		},

		removeComponent(_id) {
			Layout.remove(_id);
		}
	}),
	({which, layout, updateLayout, addComponent, removeComponent}) => (
		<div className={`grid-${which}`}>
			{which === 'control' && <ComponentSelect onSelect={addComponent} />}
			<GridLayoutWidth
				layout={layout.map(({_id, ...item}) => ({i:_id, ...item}))}
				onLayoutChange={updateLayout}
				isDraggable={which === 'control'}
				isResizable={which === 'control'}
				rowHeight={60}
			>
				{layout.map(({_id, component}) => <div key={_id}>
					{which === 'control' &&
						<CloseButton onClick={() => removeComponent(_id)}>×</CloseButton>}
					{React.createElement(components[component][which])}
				</div>)}
			</GridLayoutWidth>
		</div>
	)
);
