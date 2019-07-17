import React from 'react'
import formJson from '@quarterto/form-json'
import styled from 'styled-components'
import Ornamented from '../visual/ornamented'
import Icon from '../visual/icon'
import { useCampaignId } from '../data/campaign'
import { Button } from '../visual/primitives'
import { Card } from '../../shared/methods'
import access from '../../shared/access'
import { useCards } from '../data/card'

const relationshipLabel = {
	'-2': 'Hostile',
	'-1': 'Unfriendly',
	0: 'Neutral',
	1: 'Friendly',
	2: 'Allied',
}

const relationshipIcon = {
	'-2': 'crossed-swords',
	'-1': 'cracked-shield',
	0: 'castle-emblem',
	1: 'beer',
	2: 'two-hearts',
}

const Right = styled.span`
	float: right;
`

const ModRelationship = ({ amount, faction }) => {
	function modRelationship() {
		const relationship = (faction.relationship || 0) + amount

		if (
			amount + faction.relationship < 3 &&
			amount + faction.relationship > -3
		) {
			Card.update(faction, { relationship })
		}
	}

	return (
		<Button
			disabled={amount * faction.relationship >= 2}
			onClick={modRelationship}
		>
			{amount > 0 ? '+' : '-'}
		</Button>
	)
}

const Relationship = ({ control, faction }) => (
	<Right>
		{relationshipLabel[faction.relationship || 0]}{' '}
		<Icon icon={relationshipIcon[faction.relationship || 0]} />
		{control && (
			<span>
				<ModRelationship faction={faction} amount={+1} />
				<ModRelationship faction={faction} amount={-1} />
			</span>
		)}
	</Right>
)

const Remove = ({ faction }) => (
	<Button onClick={() => Card.delete(faction)}>×</Button>
)

const ShowFactions = ({ control = false }) => {
	const campaignId = useCampaignId()
	const { cards: factions } = useCards({ type: 'faction' })

	function onCreate(ev) {
		ev.preventDefault()
		const data = formJson(ev.target)
		ev.target.reset()

		Card.create({
			...data,
			relationship: 0,
			type: 'faction',
			campaignId,
			access: { view: access.CAMPAIGN, edit: access.PRIVATE },
		})
	}

	return (
		<div>
			<Ornamented ornament='x'>Factions</Ornamented>

			<ul>
				{factions.map(faction => (
					<li key={faction._id}>
						{faction.title}
						<Relationship control={control} faction={faction} />
						{control && <Remove faction={faction} />}
					</li>
				))}

				{control && (
					<form onSubmit={onCreate}>
						<input placeholder='Faction' name='title' />
						<Button>➕</Button>
					</form>
				)}
			</ul>
		</div>
	)
}

const FactionsControl = () => <ShowFactions control />

export { ShowFactions as display, FactionsControl as control }
