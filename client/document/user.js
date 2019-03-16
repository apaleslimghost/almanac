import React from 'react'
import styled from 'styled-components'
import colours from '@quarterto/colours'
import { compose } from 'recompact'
import Gravatar from '../visual/gravatar'
import { Label, LabelBody } from '../visual/primitives'
import { withOwnerData } from '../data/owner'
import { withLoadingComponent } from '../control/loading'
import { withSubscribe } from '../utils/subscribe'

const UserText = styled.span`
	font-style: ${({ verified }) => (verified ? 'normal' : 'italic')};
	color: ${({ verified }) => (verified ? 'inherit' : colours.steel[2])};
`

// Styled-components correctly handles arbitrary props passed to dom nodes
// and i can't be fucked working out how to implement that so
const Slurp = styled.span``

const User = ({
	user,
	component: Component = Slurp,
	small,
	children,
	...props
}) => {
	const primaryEmail = user.emails ? user.emails[0] : {}
	return (
		<Component user={user} {...props}>
			<Gravatar email={primaryEmail.address} small={small} />
			<UserText verified={primaryEmail.verified}>
				{user.username || primaryEmail.address}
			</UserText>
			{!primaryEmail.verified && (
				<Label colour='steel'>
					<LabelBody>Invite sent</LabelBody>
				</Label>
			)}

			{children}
		</Component>
	)
}

export default User

const connectOwner = compose(
	withSubscribe('campaigns.members'),
	withOwnerData('of'),
	withLoadingComponent(() => null)
)

export const Owner = connectOwner(User)
