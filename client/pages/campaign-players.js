import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withCampaignData} from '../data/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose, withState, withPropsOnChange, withHandlers} from 'recompact';
import User from '../document/user';
import {Input} from '../visual/form';
import emailRegex from 'email-regex';
import {Campaign, removeMember, addMember} from '../../shared/methods';
import {Button} from '../visual/primitives';
import subscribe from '../utils/subscribe';
import {assertAmOwner} from '../data/owner';
import {toast} from 'react-toastify';
import withLoading from '../control/loading';
import {Random} from 'meteor/random';

const withPlayerData = withTracker(({campaign, getPlayerIds}) => ({
	ready: subscribe('campaigns.members'),
	players: Meteor.users.find({
		_id: {$in: getPlayerIds(campaign)},
	}).fetch(),
}));

const connectRemoveUser = compose(
	withCampaignData,
	withHandlers({
		removeUser: ({campaign}) => user => {
			confirm(`Remove ${user.username || user.emails[0].address} from ${campaign.title}?`) && removeMember(campaign, user);
		},
	}),
);

const RemoveUser = connectRemoveUser(({user, removeUser}) =>
	<Button onClick={() => removeUser(user)}>×</Button>
);

const connectReinstateUser = compose(
	withCampaignData,
	withHandlers({
		reinstateUser: ({campaign}) => user => {
			addMember(campaign, user);
		},
	}),
);

const ReinstateUser = connectReinstateUser(({user, reinstateUser}) =>
	<Button onClick={() => reinstateUser(user)}>↑</Button>
);

const connectPlayers = compose(
	withCampaignData,
	withPlayerData,
	withLoading,
);

const Players = connectPlayers(({players, campaign, action: Action}) => <ul>
	{players.map(user => <li key={user._id}>
		<User user={user} />
		{user._id !== campaign.owner && <Action user={user} />}
	</li>)}
</ul>);

const connectPlayersPage = compose(
	withCampaignData,
	assertAmOwner('campaign'),
);

const connectInviteLink = compose(
	withCampaignData,
	withHandlers({
		toggleInvitesEnabled: ({campaign}) => () => {
			Campaign.update(campaign, {
				inviteSecret: campaign.inviteSecret ? null : Random.secret(),
			});
		}
	})
);

const InviteLink = connectInviteLink(({campaign, toggleInvitesEnabled}) => <div>
	{campaign.inviteSecret && <a href={`/${campaign._id}/join/${campaign.inviteSecret}`}>
		{location.protocol}//{location.host}/{campaign._id}/join/{campaign.inviteSecret}
	</a>}

	<Button onClick={toggleInvitesEnabled}>{campaign.inviteSecret ? 'nope' : 'yep'}</Button>
</div>);

export default connectPlayersPage(() => <div>
	<Players action={RemoveUser} getPlayerIds={campaign => [campaign.owner].concat(campaign.member)} />
	<Players action={ReinstateUser} getPlayerIds={campaign => campaign.removedMember || []} />
	<InviteLink />
</div>);
