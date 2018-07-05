import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withCampaignData} from '../data/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose, withState, withPropsOnChange, withHandlers} from 'recompact';
import User from '../document/user';
import {Input} from '../visual/form';
import search from '../utils/search';
import emailRegex from 'email-regex';
import {Campaign, createAccountAndInvite, addMember, removeMember} from '../../shared/methods';
import {Button} from '../visual/primitives';
import subscribe from '../utils/subscribe';

const userSearch = search(Meteor.users, {
	includeMatches: true,
	includeScore: true,
	shouldSort: true,
	keys: [
		'username',
		'emails.address',
	],
});

const withPlayerData = withTracker(({campaign}) => ({
	loading: subscribe('campaigns.members'),
	players: Meteor.users.find({
		_id: {$in: [campaign.owner].concat(campaign.member || [])},
	}).fetch(),

	removeUser(user) {
		confirm(`Remove ${user.username || user.emails[0].address} from ${campaign.title}?`) && removeMember(campaign, user);
	},
}));

const connectPlayers = compose(
	withCampaignData,
	withPlayerData,
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
	withPropsOnChange(['search'], ({search, campaign}) => ({
		results: userSearch(search).filter(
			({item}) => ![campaign.owner].concat(campaign.member || []).includes(item._id)
		),
		isEmail: emailRegex({exact: true}).test(search),
	})),
	withTracker(({search, isEmail}) => ({
		isExistingUser: isEmail && Meteor.users.findOne({
			emails: {$elemMatch: {address: search}}
		}),
	}))
);

const connectInviteUser = compose(
	withCampaignData,
	withHandlers({
		inviteUser: ({campaign, email}) => ev => {
			createAccountAndInvite({email}, campaign);
			//TODO success messaging
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
	<Input onChange={ev => setSearch(ev.target.value)} value={search} placeholder='Search for a user...' />

	{isEmail && !isExistingUser &&
		<InviteUser email={search} />
	}

	{!!search && (
		results.length
		? <ul>
			{results.map(
				(result) => <li key={result.item._id}>
					<User user={result.item} component={SelectUser} />
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
