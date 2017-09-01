import React from 'react';
import * as components from './';
import updatePath from '@quarterto/update-path';

import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';

const updateSession = (key, updater) => SyncedSession.set(
	key,
	updater(SyncedSession.get(key))
);

const PlaceholderControl = createContainer(({location}) => ({
	selectComponent(ev) {
		const component = ev.target.selectedOptions[0].value;
		updateSession('layout', layout => updatePath(layout, location, () => component));
	}
}), ({selectComponent}) => <div>
	<select defaultValue={0} onChange={selectComponent}>
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
