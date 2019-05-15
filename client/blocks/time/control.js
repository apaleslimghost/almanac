import React from 'react'
import { compose, withState, withHandlers, withPropsOnChange } from 'recompact'
import { withCampaignSession } from '../../data/campaign'
import { Button, List, Group } from '../../visual/primitives'
import { Input } from '../../visual/form'
import { withCampaignDate } from '../../data/calendar'
import preventingDefault from '../../utils/preventing-default'
import connectTime from './connect/time'
import Time from './display'
import withIncrement from './connect/increment'
import AdvanceTime from './advance'

const connectIncrement = compose(
	withCampaignSession,
	withCampaignDate,
	withIncrement,
)

const Inc = connectIncrement(({ onIncrement, multiplier = 1, period }) => (
	<Button large={false} colour='steel' onClick={onIncrement}>
		{multiplier > 0 && '+'}
		{multiplier}
		{period[0]}
	</Button>
))

const withDateActions = withHandlers({
	onSubmit: ({ CampaignDate, campaignSession, _date }) => () => {
		campaignSession.set('date', new CampaignDate(_date).timestamp)
	},
})

const withDateState = withState('_date', 'setDate', ({ date }) => date.P)

const connectDateForm = compose(
	withCampaignSession,
	withCampaignDate,
	connectTime,
	withDateState,
	withDateActions,
	withPropsOnChange(['date'], ({ date, setDate }) => {
		setDate(date.P)
	}),
)

const DateForm = connectDateForm(({ _date, setDate, onSubmit }) => (
	<form onSubmit={preventingDefault(onSubmit)}>
		<Input value={_date} size={35} onChange={ev => setDate(ev.target.value)} />
		<Button>Set</Button>
	</form>
))

const TimeControl = () => (
	<div>
		<Time />

		<List>
			<Group>
				<Inc period='minute' />
				<Inc period='minute' multiplier={5} />
				<Inc period='minute' multiplier={10} />
				<Inc period='minute' multiplier={30} />
			</Group>

			<Group>
				<Inc period='hour' />
				<Inc period='hour' multiplier={8} />
			</Group>

			<Group>
				<Inc period='day' />
			</Group>
		</List>

		<DateForm />

		<AdvanceTime />
	</div>
)

export default TimeControl
