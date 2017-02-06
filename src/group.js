import React from 'react';
import map from 'lodash.map';

export default ({components, which}) => <div>
	{map(components, ({[which]: Component}, name) => <Component key={name} />)}
</div>;