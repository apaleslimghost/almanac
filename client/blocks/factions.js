import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import formJson from '@quarterto/form-json';
import {Factions} from '../../shared/collections';
import Ornamented from '../components/ornamented';
import Icon from '../components/icon';
import styled from 'styled-components';

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

const Relationship = ({level, control, modRelationship, faction}) => <Right>
	{relationshipLabel[level]}{' '}
	<Icon icon={relationshipIcon[level]} />

	{control && <span>
		<button onClick={() => modRelationship(+1, faction)}>+</button>
		<button onClick={() => modRelationship(-1, faction)}>-</button>
	</span>}
</Right>;

const ShowFactions = createContainer(() => ({
	factions: Factions.find().fetch(),

	onCreate(ev) {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();
		Factions.insert(Object.assign({relationship: 0}, data));
	},

	modRelationship(amount, faction) {
		if(amount + faction.relationship < 3 && amount + faction.relationship > -3) {
			Factions.update(faction._id, {
				$inc: {relationship: amount},
			});
		}
	},

	remove(faction) {
		Factions.remove(faction._id);
	}
}), ({factions, onCreate, modRelationship, remove, control = false}) => <div>
	<Ornamented ornament='x'>Factions</Ornamented>

	<ul>
		{factions.map(faction => <li key={faction._id}>
			{faction.name}
			<Relationship
				level={faction.relationship}
				control={control}
				modRelationship={modRelationship}
				faction={faction}
			/>
			{control && <button onClick={() => remove(faction)}>×</button>}
		</li>)}

		{control && <form onSubmit={onCreate}>
			<input placeholder='Faction' name='name' />
			<button>➕</button>
		</form>}
	</ul>
</div>);

const FactionsControl = () => <ShowFactions control />;

export {
	ShowFactions as display,
	FactionsControl as control
};
