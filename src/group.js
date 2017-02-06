import React from 'react';
import map from 'lodash.map';
import * as components from '../src/components';

export default ({which}) => <div>
	{map(components, ({[which]: Component}, name) => <Component key={name} />)}
</div>;