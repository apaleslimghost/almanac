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

const connectPlayerSearch = compose(
	withCampaignData,
	withState('search', 'setSearch', ''),
	withPropsOnChange(['search'], ({search}) => ({
		isEmail: emailRegex({exact: true}).test(search),
	})),
	withTracker(({search, isEmail, campaign}) => ({
		ready: subscribe('users.search', search),
		results: Meteor.users.find({
			_id: {$nin: [campaign.owner].concat(campaign.member)}
		}).fetch(),
		isExistingUser: isEmail && Meteor.users.findOne({
			emails: {$elemMatch: {address: search}}
		}),
	}))
);

const connectInviteUser = compose(
	withCampaignData,
	withHandlers({
		inviteUser: ({campaign, email}) => async ev => {
			await createAccountAndInvite({email}, campaign);
			toast.success(`${email} invited to ${campaign.name}`);
		}
	})
);

const InviteUser = connectInviteUser(({email, inviteUser}) => <Button onClick={inviteUser}>
	Invite {email} to Almanac
</Button>);

const connectSelectUser = compose(
	withCampaignData,
	withHandlers({
		addUser: ({campaign, user}) => ev => {
			ev.preventDefault();
			addMember(campaign, user);
		}
	})
);

const SelectUser = connectSelectUser(({children, addUser}) =>
	<a href='#' onClick={addUser}>
		{children}
	</a>
);

const PlayerSearch = connectPlayerSearch(({search, setSearch, results, isEmail, isExistingUser}) => <div>
	<Input type='search' onChange={ev => setSearch(ev.target.value)} value={search} placeholder='Search for a user...' />

	{isEmail && !isExistingUser &&
		<InviteUser email={search} />
	}

	{!!search && (
		results.length
		? <ul>
			{results.map(
				user => <li key={user._id}>
					<User user={user} component={SelectUser} />
				</li>
			)}
		</ul>
		: 'No users found'
	)}
</div>);

export default () => <div>
	<Players />
	<PlayerSearch />
</div>;
