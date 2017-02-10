import React from 'react';
import updatePath from '@quarterto/update-path';
import removeArrayIndex from '@quarterto/remove-array-index';
import insertArrayIndex from '@quarterto/insert-array-index';
import {observe} from '../store';
import last from 'lodash.last';
import initial from 'lodash.initial';

const addPlaceholderToParent = (layout, location) =>
	updatePath(layout, initial(location), parent => parent.concat('placeholder'));

const addPlaceholderToCurrent = (layout, location) =>
	updatePath(layout, location, component => [component, 'placeholder']);

const LayoutControl = observe(({location, direction}, {dispatch}) => <div>
	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), parent => {
			const next = removeArrayIndex(last(location))(parent);
			if(location.length > 1 && next.length === 1 && !Array.isArray(next[0])) {
				return next[0];
			}

			if(location.length === 1 && next.length === 0) {
				return ['placeholder'];
			}

			return next;
		})
	)}>×</button>

	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, location, () => 'placeholder')
	)}>∅</button>

	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, location, component => ({component: component.component || component, flex: prompt('Flex size?')}))
	)}>⁒</button>

	<button onClick={() => dispatch('layout', layout =>
		(direction === 'column' ? addPlaceholderToParent : addPlaceholderToCurrent)(layout, location)
	)}>≡</button>

	<button onClick={() => dispatch('layout', layout =>
		(direction === 'row' ? addPlaceholderToParent : addPlaceholderToCurrent)(layout, location)
	)}>⦀</button>
</div>);

export default LayoutControl;