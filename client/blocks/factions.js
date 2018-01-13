import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import formJson from '@quarterto/form-json';
import {Cards} from '../../shared/collections';
import Ornamented from '../components/ornamented';
import Icon from '../components/presentation/icon';
import styled from 'styled-components';
import {withCampaign} from '../components/campaign';
import {compose, withHandlers, withProps} from 'recompose';
import {Button} from '../components/primitives';

const relationshipLabel = {
	'-2': 'Hostile',
	'-1': 'Unfriendly',
	 '0': 'Neutral',
	 '1': 'Friendly',
	 '2': 'Allied',
};

const relationshipIcon = {
	'-2': 'crossed-swords',
	'-1': 'cracked-shield',
	 '0': 'castle-emblem',
	 '1': 'beer',
	 '2': 'two-hearts',
};

const Right = styled.span`
	float: right;
`;

const connectModRelationship = withHandlers({
	modRelationship: ({amount, faction}) => ev => {
		if(amount + faction.relationship < 3 && amount + faction.relationship > -3) {
			Cards.update(faction._id, {
				$inc: {relationship: amount},
			});
		} else if(!faction.relationship) {
			Cards.update(faction._id, {
				$set: {relationship: amount},
			});
		}
	},
});

const ModRelationship = connectModRelationship(({amount, faction, modRelationship}) =>
	<Button disabled={amount * faction.relationship >= 2} onClick={modRelationship}>
		{amount > 0 ? '+' : '-'}
	</Button>
);

const Relationship = ({control, modRelationship, faction}) => <Right>
	{relationshipLabel[faction.relationship || 0]}{' '}
	<Icon icon={relationshipIcon[faction.relationship || 0]} />

	{control && <span>
		<ModRelationship faction={faction} amount={+1} />
		<ModRelationship faction={faction} amount={-1} />
	</span>}
</Right>;

const withFactionActions = withHandlers({
	onCreate: ({campaignId}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();
		Cards.insert({
			...data,
			relationship: 0,
			type: 'faction',
			campaignId
		});
	},
});

const connectRemoveButton = withHandlers({
	remove: ({faction}) => ev => {
		Cards.remove(faction._id);
	},
});

const Remove = connectRemoveButton(
	({remove}) => <Button onClick={remove}>×</Button>
);

const withFactionData = withTracker(({campaignId}) => ({
	factions: Cards.find({type: 'faction', campaignId}).fetch(),
}));

const connectFactions = compose(
	withCampaign,
	withFactionData,
	withFactionActions
);

const ShowFactions = connectFactions(({factions, onCreate, remove, control = false}) => <div>
	<Ornamented ornament='x'>Factions</Ornamented>

	<ul>
		{factions.map(faction => <li key={faction._id}>
			{faction.title}
			<Relationship
				control={control}
				faction={faction}
			/>
			{control && <Remove faction={faction} />}
		</li>)}

		{control && <form onSubmit={onCreate}>
			<input placeholder='Faction' name='title' />
			<Button>➕</Button>
		</form>}
	</ul>
</div>);

const FactionsControl = withProps({control: true})(ShowFactions);

export {
	ShowFactions as display,
	FactionsControl as control
};
