import React from 'react'
import styled from 'styled-components'
import colours from '@quarterto/colours'
import Gravatar from '../visual/gravatar'
import { Label, LabelBody } from '../visual/primitives'
import { withOwnerData } from '../data/owner'
import { withLoadingComponent } from '../control/loading'
import { withSubscribe } from '../utils/subscribe'
import { compose } from 'recompact';

const UserText = styled.span`
	font-style: ${({ verified }) => (verified ? 'normal' : 'italic')};
	color: ${({ verified }) => (verified ? colours.steel[0] : colours.steel[2])};
`

// styled-components correctly handles arbitrary props passed to dom nodes
// and i can't be fucked working out how to implement that so
const Slurp = styled.span``

const User = ({
	user,
	component: Component = Slurp,
	children,
	...props
}) => <Component user={user} {...props}>
		<Gravatar email={user.emails[0].address} />
		<UserText verified={user.emails[0].verified}>
			{user.username || user.emails[0].address}
		</UserText>
		{!user.emails[0].verified && (
			<Label colour='steel'>
				<LabelBody>Invite sent</LabelBody>
			</Label>
		)}

		{children}
	</Component>


export default User

const connectOwner = compose(
	withSubscribe('campaigns.members'),
	withOwnerData('of'),
	withLoadingComponent(null)
)

export const Owner = withOwnerData('of')(User)