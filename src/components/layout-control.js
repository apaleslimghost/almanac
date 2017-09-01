import React from 'react';
import updatePath from '@quarterto/update-path';
import removeArrayIndex from '@quarterto/remove-array-index';
import insertArrayIndex from '@quarterto/insert-array-index';
import last from 'lodash.last';
import initial from 'lodash.initial';
import {createContainer} from 'meteor/react-meteor-data';
import SyncedSession from 'meteor/quarterto:synced-session';

if(!SyncedSession.get('layout')) {
	SyncedSession.set('layout', ['placeholder']);
}

const updateSession = (key, updater) => SyncedSession.set(
	key,
	updater(SyncedSession.get(key))
);

const addPlaceholderToParent = (layout, location) =>
	updatePath(layout, initial(location), parent => parent.concat('placeholder'));

const addPlaceholderToCurrent = (layout, location) =>
	updatePath(layout, location, component => [component, 'placeholder']);

const LayoutControl = createContainer(({location, direction}) => ({
	removePane() {
		updateSession('layout', layout =>
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
		);
	},

	recyclePane() {
		updateSession('layout', layout =>
			updatePath(layout, location, () => 'placeholder')
		);
	},

	resizePane() {
		updateSession('layout', layout =>
			updatePath(layout, location, component => ({component: component.component || component, flex: prompt('Flex size?', component.flex || 'auto')}))
		);
	},

	addPaneBelow() {
		updateSession('layout', layout =>
			(direction === 'column' ? addPlaceholderToParent : addPlaceholderToCurrent)(layout, location)
		);
	},

	addPaneRight() {
		updateSession('layout', layout =>
			(direction === 'row' ? addPlaceholderToParent : addPlaceholderToCurrent)(layout, location)
		);
	},
}),
({removePane, recyclePane, resizePane, addPaneBelow, addPaneRight}) => <div>
	<button onClick={removePane}>❌</button>
	<button onClick={recyclePane}>♻️</button>
	<button onClick={resizePane}>➗</button>
	<button onClick={addPaneBelow}>⏬</button>
	<button onClick={addPaneRight}>⏩</button>
</div>);

export default LayoutControl;
