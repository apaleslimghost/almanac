import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import relativeDate from 'tiny-relative-date'
import { Link } from 'use-history'
import { compose } from 'recompact'

import styled from 'styled-components'
import Icon from '../visual/icon'
import { Owner } from '../document/user'
import { CardHistory } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import match from '../utils/match'
import { withCampaignId } from '../data/campaign'

const withHistory = withTracker(({ campaignId }) => ({
	ready: subscribe('cards.history'),
	history: CardHistory.find(
		{ campaignId },
		{ sort: [['date', 'desc']] },
	).fetch(),
}))

const connectHistory = compose(
	withCampaignId,
	withHistory,
)

const withCardHistory = withTracker(({ card }) => ({
	ready: subscribe('cards.history'),
	history: CardHistory.find(
		{ 'data._id': card._id },
		{ sort: [['date', 'desc']] },
	).fetch(),
}))

const getHistoryIcon = match({
	add: 'file-text-o',
	edit: 'edit',
	link: 'link',
	unlink: 'chain-broken',
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

const ChangeData = data => (
	<>
		{data.type && `the ${data.type} `}
		<Link href={`/${data.campaignId}/${data._id}`}>{data.title}</Link>
	</>
)

const HistoryList = ({ history, ...props }) => (
	<IconList {...props}>
		{history.map(change => (
			<li key={change._id}>
				<Icon icon={getHistoryIcon(change.verb)} />
				{change.verb + 'ed '}
				{change.data && <ChangeData {...change.data} />}
				{change.extra && (
					<>
						{' '}
						and <ChangeData {...change.extra} />
					</>
				)}
				<br />
				<ChangeMeta>
					<Owner small of={change} />{' '}
					<time
						dateTime={change.date.toISOString()}
						title={change.date.toLocaleString()}
					>
						{relativeDate(change.date)}
					</time>
				</ChangeMeta>
			</li>
		))}
	</IconList>
)

export default connectHistory(HistoryList)
export const CardHistoryList = withCardHistory(HistoryList)
