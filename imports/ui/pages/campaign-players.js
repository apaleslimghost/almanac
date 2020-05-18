import { Meteor } from 'meteor/meteor'
import { useTracker } from '../utils/hooks'
import { Random } from 'meteor/random'
import React from 'react'
import { useCampaign } from '../data/campaign'
import User from '../document/user'
import { Campaign, removeMember, addMember } from '../../lib/methods'
import { Button } from '../visual/primitives'
import { H2 } from '../visual/heading'
import { Main } from '../visual/grid'
import { useAssertAmOwner } from '../data/owner'

const RemoveUser = ({ user }) => {
	const campaign = useCampaign()

	function removeUser() {
		const reallyRemove = confirm(
			`Remove ${user.username || user.emails[0].address} from ${
				campaign.title
			}?`,
		)

		if (reallyRemove) {
			removeMember(campaign, user)
		}
	}

	return <Button onClick={removeUser}>×</Button>
}

const ReinstateUser = ({ user }) => {
	const campaign = useCampaign()

	return <Button onClick={() => addMember(campaign, user)}>↑</Button>
}

const Players = ({ actionComponent: Action, playerIds }) => {
	const campaign = useCampaign()
	const players = useTracker(
		() =>
			Meteor.users
				.find({
					_id: { $in: playerIds },
				})
				.fetch(),
		[playerIds],
	)

	return (
		<ul>
			{players.map(user => (
				<li key={user._id}>
					<User user={user} />
					{user._id !== campaign.owner && <Action user={user} />}
				</li>
			))}
		</ul>
	)
}

const InviteLink = () => {
	const campaign = useCampaign()

	return (
		<div>
			{campaign.inviteSecret && (
				<a href={`/${campaign._id}/join/${campaign.inviteSecret}`}>
					{`${location.protocol}//${location.host}/${campaign._id}/join/`}
					{campaign.inviteSecret}
				</a>
			)}

			<Button
				onClick={() => {
					Campaign.update(campaign, {
						inviteSecret: campaign.inviteSecret ? null : Random.secret(),
					})
				}}
			>
				{campaign.inviteSecret ? 'nope' : 'yep'}
			</Button>
		</div>
	)
}

export default () => {
	const campaign = useCampaign()
	useAssertAmOwner(campaign)

	return (
		<Main>
			<H2>Current players</H2>
			<Players
				actionComponent={RemoveUser}
				playerIds={[campaign.owner].concat(campaign.member)}
			/>

			<H2>Removed players</H2>
			<Players
				actionComponent={ReinstateUser}
				playerIds={campaign.removedMember || []}
			/>

			<H2>Invitations</H2>
			<InviteLink />
		</Main>
	)
}
