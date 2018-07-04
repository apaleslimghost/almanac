import React from 'react';
import Gravatar from '../visual/gravatar';

export default ({user, component: Component = 'span', ...props}) => <Component {...props}>
	<Gravatar email={user.emails[0].address} />
	{user.username || user.emails[0].address}
</Component>;
