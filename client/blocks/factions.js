import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import formJson from '@quarterto/form-json';
import {Cards} from '../../shared/collections';
import Ornamented from '../components/ornamented';
import Icon from '../components/icon';
import styled from 'styled-components';
import {withCampaign} from '../components/campaign';

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

const Relationship = ({level = 0, control, modRelationship, faction}) => <Right>
	{relationshipLabel[level]}{' '}
	<Icon icon={relationshipIcon[level]} />

	{control && <span>
		<button disabled={level >= 2}  onClick={() => modRelationship(+1, faction)}>+</button>
		<button disabled={level <= -2} onClick={() => modRelationship(-1, faction)}>-</button>
	</span>}
</Right>;

const ShowFactions = withCampaign(createContainer(({campaignId}) => ({
	factions: Cards.find({type: 'faction', campaignId}).fetch(),

	onCreate(ev) {
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

	modRelationship(amount, faction) {
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

	remove(faction) {
		Cards.remove(faction._id);
	}
}), ({factions, onCreate, modRelationship, remove, control = false}) => <div>
	<Ornamented ornament='x'>Factions</Ornamented>

	<ul>
		{factions.map(faction => <li key={faction._id}>
			{faction.title}
			<Relationship
				level={faction.relationship}
				control={control}
				modRelationship={modRelationship}
				faction={faction}
			/>
			{control && <button onClick={() => remove(faction)}>×</button>}
		</li>)}

		{control && <form onSubmit={onCreate}>
			<input placeholder='Faction' name='title' />
			<button>➕</button>
		</form>}
	</ul>
</div>));

const FactionsControl = () => <ShowFactions control />;

export {
	ShowFactions as display,
	FactionsControl as control
};
