import React from 'react';
import * as components from './';
import {observe} from '../store';
import updatePath from '@quarterto/update-path';

const PlaceholderControl = observe(({location}, {dispatch}) => <div>
	<select defaultValue={0} onChange={ev => {
		const component = ev.target.selectedOptions[0].value;
		dispatch('layout', layout => updatePath(layout, location, () => component));
	}}>
		<option value={0} disabled>Component&hellip;</option>
		{Object.keys(components).filter(c => c !== 'placeholder').map(component => 
			<option value={component} key={component}>{component}</option>)}
	</select>
</div>);

const Placeholder = () => <div></div>;

export {
	PlaceholderControl as control,
	Placeholder as display
};