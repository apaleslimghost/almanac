import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withCampaignData} from '../data/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose, withState, withPropsOnChange} from 'recompact';
import User from '../document/user';
import {Input} from '../visual/form';
import search from '../utils/search';
import emailRegex from 'email-regex';
import {Campaign} from '../../shared/methods';

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
	players: Meteor.users.find({
		_id: {$in: [campaign.owner].concat(campaign.member || [])}
	}).fetch(),
}));

const connectPlayers = compose(
	withCampaignData,
	withPlayerData
);

const Players = connectPlayers(({players}) => <ul>
	{players.map(user => <li key={user._id}>
		<User user={user} />
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

const connectSelectUser = compose(
	withCampaignData,
	withHandlers({
		addUser: ({campaign, user}) => ev => {
			ev.preventDefault();
			Campaign.update(campaign._id, {
				$addToSet: {member: user._id} // can't do this yet kara, cf collection-methods.js#44
			})
		}
	})
);

const SelectUser = ({children}) => withTracker(() => ({
	addUser(ev) {

	}
}))(<a href='#'>
	{children}
</a>);

const PlayerSearch = connectPlayerSearch(({search, setSearch, results, isEmail, isExistingUser}) => <div>
	<Input onChange={ev => setSearch(ev.target.value)} value={search} placeholder='Search for a user...' />

	{isEmail && !isExistingUser && `Invite ${search} to Almanac...`}

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

export default () =><div>
	<Players />
	<PlayerSearch />
</div>;
