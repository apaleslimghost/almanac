import React from 'react'
import {withState, withProps, compose} from 'recompact'
import withTimer from '../../utils/timer'
import {withCampaignSession} from '../../data/campaign'
import withIncrement from './connect/increment'

const connectAdvanceTime = compose(
	withState('enabled', 'setEnabled', false),
	withCampaignSession,
	withProps({period: 'minute', amount: 1}),
	withIncrement,
	withTimer(30000, ({enabled, onIncrement}) => enabled && onIncrement())
)

const AdvanceTime = ({enabled, setEnabled}) => (
	<label>
		<input
			type='checkbox'
			checked={enabled}
			onChange={ev => setEnabled(ev.target.checked)}
		/>
		Advance time
	</label>
)

export default connectAdvanceTime(AdvanceTime)
