import React from 'react';
import updatePath from '@quarterto/update-path';
import removeArrayIndex from '@quarterto/remove-array-index';
import insertArrayIndex from '@quarterto/insert-array-index';
import {observe} from '../store';
import last from 'lodash.last';
import initial from 'lodash.initial';

const LayoutControl = observe(({component, location, length, direction}, {dispatch}) => <div>
	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), removeArrayIndex(last(location)))
	)}>×</button>

	{last(location) !== 0 && <button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), arr => {
			const pos = last(location);
			const [other, me] = arr.slice(pos - 1, pos + 1);
			arr[pos - 1] = me;
			arr[pos] = other;
			return arr;
		})
	)}>{direction === 'row' ? '←' : '↑'}</button>}

	{last(location) !== length - 1 && <button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), arr => {
			const pos = last(location);
			const [me, other] = arr.slice(pos, pos + 2);
			arr[pos + 1] = me;
			arr[pos] = other;
			return arr;
		})
	)}>{direction === 'row' ? '→' : '↓'}</button>}

	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), insertArrayIndex(last(location), 'placeholder'))
	)}>+{direction === 'row' ? '←' : '↑'}</button>

	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, initial(location), insertArrayIndex(last(location) + 1, 'placeholder'))
	)}>+{direction === 'row' ? '→' : '↓'}</button>

	<button onClick={() => dispatch('layout', layout =>
		updatePath(layout, location, () => 'placeholder')
	)}>∅</button>
</div>);

export default LayoutControl;
