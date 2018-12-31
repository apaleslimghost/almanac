import React from 'react'
import styled from 'styled-components'
import colours from '@quarterto/colours'
import Gravatar from '../visual/gravatar'
import { Label, LabelBody } from '../visual/primitives'
import { withOwnerData } from '../data/owner'

const UserText = styled.span`
	font-style: ${({ verified }) => (verified ? 'normal' : 'italic')};
	color: ${({ verified }) => (verified ? colours.steel[0] : colours.steel[2])};
`

const User = ({
	user,
	component: Component = 'span',
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

export const Owner = withOwnerData(
	props => props.of
)(User)