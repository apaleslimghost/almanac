import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withCampaignData} from '../data/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose, withState, withPropsOnChange, withHandlers} from 'recompact';
import User from '../document/user';
import {Input} from '../visual/form';
import emailRegex from 'email-regex';
import {Campaign, createAccountAndInvite, addMember, removeMember} from '../../shared/methods';
import {Button} from '../visual/primitives';
import subscribe from '../utils/subscribe';
import {assertAmOwner} from '../data/owner';
import {toast} from 'react-toastify';
import withLoading from '../control/loading';

const withPlayerData = withTracker(({campaign}) => ({
	ready: subscribe('campaigns.members'),
	players: Meteor.users.find({
		_id: {$in: [campaign.owner].concat(campaign.member)},
	}).fetch(),

	removeUser(user) {
		confirm(`Remove ${user.username || user.emails[0].address} from ${campaign.title}?`) && removeMember(campaign, user);
	},
}));

const connectPlayers = compose(
	withCampaignData,
	assertAmOwner('campaign'),
	withPlayerData,
	withLoading,
);

const Players = connectPlayers(({players, campaign, removeUser}) => <ul>
	{players.map(user => <li key={user._id}>
		<User user={user} />
		{user._id !== campaign.owner &&
			<Button onClick={() => removeUser(user)}>×</Button>
		}
	</li>)}
</ul>);

const connectInviteUser = compose(
	withCampaignData,
	withState('email', 'setEmail', ''),
	withPropsOnChange(['email'], ({email}) => ({
		isEmail: emailRegex({exact: true}).test(email),
	})),
	withHandlers({
		inviteUser: ({campaign, email}) => async ev => {
			await createAccountAndInvite({email}, campaign);
			toast.success(`${email} invited to ${campaign.name}`);
		}
	})
);

const InviteUser = connectInviteUser(({email, setEmail, isEmail, inviteUser}) => <div>
	<Input type='email' onChange={ev => setEmail(ev.target.value)} value={email} placeholder='Invite a user...' />

	<Button onClick={inviteUser} disabled={!isEmail}>
		Invite
	</Button>
</div>);

export default () => <div>
	<Players />
	<InviteUser />
</div>;
