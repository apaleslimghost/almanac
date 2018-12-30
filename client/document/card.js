import React from 'react'
import _ from 'lodash'

import Link from '../control/link'

import { Card as CardPrimitive, Label, LabelBody } from '../visual/primitives'
import Markdown from './markdown'

export default ({ card }) => (
	<CardPrimitive>
		<Label colour='sky'>
			<LabelBody>{card.type}</LabelBody>
		</Label>

		<article>
			<h1>
				<Link href={`/${card.campaignId}/${card._id}`}>{card.title}</Link>
			</h1>

			<Markdown excerpt source={card.text || ''} />
		</article>
	</CardPrimitive>
)
