import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import relativeDate from 'tiny-relative-date'

import styled from 'styled-components'
import Icon from '../visual/icon'
import { Owner } from '../document/user'
import { CardHistory } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import match from '../utils/match'
import Link from '../control/link'

const withHistory = withTracker(() => ({
	ready: subscribe('cards.history'),
	history: CardHistory.find({}, { sort: [['date', 'desc']] }).fetch()
}))

const withCardHistory = withTracker(({ card }) => ({
	ready: subscribe('cards.history'),
	history: CardHistory.find(
		{ 'data._id': card._id },
		{ sort: [['date', 'desc']] }
	).fetch()
}))

const getHistoryIcon = match({
	add: 'file-text-o',
	edit: 'edit'
})

const IconList = styled.ul`
	padding: 0;
	margin: 1em 0 1em 0.75em;
	list-style: none;

	li {
		margin-left: 0.75em;
		margin-bottom: 0.5em;
	}

	.fa,
	.ra {
		margin-right: 0.25em;
		margin-left: -1.25em;
	}
`

const ChangeMeta = styled.span`
	font-size: 0.8em;
	color: rgba(0, 0, 0, 0.6);
`

const HistoryList = ({ history, ...props }) => (
	<IconList {...props}>
		{history.map(change => (
			<li key={change._id}>
				<Icon icon={getHistoryIcon(change.verb)} />
				{change.verb + 'ed '}
				the {change.data.type + ' '}
				<Link href={`/${change.data.campaignId}/${change.data._id}`}>
					{change.data.title}
				</Link>
				<br />
				<ChangeMeta>
					<Owner small of={change} /> {relativeDate(change.date)}
				</ChangeMeta>
			</li>
		))}
	</IconList>
)

export default withHistory(HistoryList)
export const CardHistoryList = withCardHistory(HistoryList)
