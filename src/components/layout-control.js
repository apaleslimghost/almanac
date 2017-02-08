import React from 'react';
import updatePath from '@quarterto/update-path';
import removeArrayIndex from '@quarterto/remove-array-index';
import {observe} from '../store';

const LayoutControl = observe(({component, location}, {dispatch}) => <div>
	<button onClick={() => dispatch('layout', layout => {
		const path = location.slice(0, -1);
		const us = location[location.length - 1];
		return updatePath(layout, path, removeArrayIndex(us));
	})}>×</button>
</div>);

export default LayoutControl;
