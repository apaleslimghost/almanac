import React from 'react'
import _ from 'lodash'

import Markdown from './markdown'
import schema from '../../shared/schema'
import Link from '../control/link'

import {
	Card as CardPrimitive,
	Label,
	List,
	LabelTitle,
	LabelBody
} from '../visual/primitives'

import { PrivacyIcons } from '../control/privacy'

export default ({ card }) => (
	<CardPrimitive>
		{card.type && (
			<Label colour='sky'>
				<LabelBody>{card.type}</LabelBody>
			</Label>
		)}

		<PrivacyIcons access={card.access} />

		<article>
			<h1>
				<Link href={`/${card.campaignId}/${card._id}`}>{card.title}</Link>
			</h1>

			<Markdown source={card.text || ''} />
		</article>

		<List>
			{_.map(schema[card.type].fields, ({ label, format = a => a }, key) => (
				<Label key={key} sunken>
					<LabelTitle>{label}</LabelTitle>
					<LabelBody>{format(card[key])}</LabelBody>
				</Label>
			))}
		</List>
	</CardPrimitive>
)
