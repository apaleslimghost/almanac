import React, { useState, useEffect } from 'react'
import { useCampaignSession } from '../../data/campaign'
import { Button, List, Group } from '../../visual/primitives'
import { Input } from '../../visual/form'
import { useCampaignDate } from '../../data/calendar'
import preventingDefault from '../../utils/preventing-default'
import Time from './display'
import AdvanceTime from './advance'
import { useTracker } from '../../utils/hooks'

const Inc = ({ multiplier = 1, period }) => {
	const campaignSession = useCampaignSession()
	const CampaignDate = useCampaignDate()

	function onIncrement() {
		campaignSession.set(
			'date',
			new CampaignDate(campaignSession.get('date') || 0).add({
				[period]: multiplier,
			}).timestamp,
		)
	}

	return (
	<Button large={false} colour='steel' onClick={onIncrement}>
		{multiplier > 0 && '+'}
		{multiplier}
		{period[0]}
	</Button>
	)
}

const startOfDay = timestamp => timestamp - (timestamp % 86400)

const Morning = () => {
	const campaignSession = useCampaignSession()

	function onMorning() {
		campaignSession.set(
			'date',
			startOfDay(campaignSession.get('date') || 0) + 86400 + 28800,
		)
	}

	return <Button large={false} colour='steel' onClick={onMorning}>
		🌅
	</Button>
}


const DateForm = () => {
	const campaignSession = useCampaignSession()
	const CampaignDate = useCampaignDate()
	const date = useTracker(
		() => new CampaignDate(campaignSession.get('date') || 0),
			)
	const [_date, setDate] = useState(date.P)

	useEffect(() => {
		setDate(date.P)
	}, [date])

	function onSubmit() {
		campaignSession.set('date', new CampaignDate(_date).timestamp)
	}
}

	return (
	<form onSubmit={preventingDefault(onSubmit)}>
			<Input
				value={_date}
				size={35}
				onChange={ev => setDate(ev.target.value)}
			/>
		<Button>Set</Button>
	</form>
	)
}

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
	
			<Group>
				<Morning />
			</Group>
		</List>

		<DateForm />

		<AdvanceTime />
	</div>
)

export default TimeControl
