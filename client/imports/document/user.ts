import React from 'react';
import Gravatar from '../visual/gravatar';
import styled from 'styled-components';
import colours from '@quarterto/colours';
import {Label, LabelBody} from '../visual/primitives';

const UserText = styled.span`
	font-style: ${({verified}) => verified ? 'normal' : 'italic'};
	color: ${({verified}) => verified ? colours.steel[0] : colours.steel[2]};
`;

export default ({user, component: Component = 'span', children, ...props}) => <Component user={user} {...props}>
	<Gravatar email={user.emails[0].address} />
	<UserText verified={user.emails[0].verified}>
		{user.username || user.emails[0].address}
	</UserText>
	{!user.emails[0].verified && <Label colour='steel'><LabelBody>Invite sent</LabelBody></Label>}

	{children}
</Component>;
