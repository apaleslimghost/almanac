import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import relativeDate from 'tiny-relative-date'

import Icon from '../visual/icon'
import { Owner } from '../document/user'
import { CardHistory } from '../../shared/collections'
import subscribe from '../utils/subscribe'
import match from '../utils/match'

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

const HistoryList = ({ history, ...props }) => (
	<ul {...props}>
		{history.map(change => (
			<li key={change._id}>
				<Icon icon={getHistoryIcon(change.verb)} />
				{change.verb + 'ed '}
				{change.data.title}
				<br />
				<small>
					<Owner small of={change} /> {relativeDate(change.date)}
				</small>
			</li>
		))}
	</ul>
)

export default withHistory(HistoryList)
export const CardHistoryList = withCardHistory(HistoryList)
