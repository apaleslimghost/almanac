import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Portal from 'react-portal'
import Modal from '../../visual/modal'
import Ornamented from '../../visual/ornamented'
import { Cards } from '../../../shared/collections'
import { useComputation } from '../../data/computation'
import access from '../../../shared/access'
import { useSubscription } from '../../utils/hooks'

const QuestHeader = styled(Ornamented)`
	font-family: 'Libre Baskerville', serif;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`

const ObjectiveHeader = styled.h2`
	font-family: 'Source Sans Pro', sans-serif;
	font-weight: 300;
	font-size: 4em;
	margin: 0;
	line-height: 1;
`

const Description = styled.h3`
	font-family: 'Source Sans Pro', sans-serif;
	font-weight: 300;
	font-size: 2.4em;
	line-height: 1;
`

const Splash = ({ action, quest, objective, animationState }) => (
	<Modal animationState={animationState}>
		{!objective && (
			<ObjectiveHeader>
				{action === 'complete' ? 'Completed:' : 'Started:'}
			</ObjectiveHeader>
		)}
		<QuestHeader ornament='u'>{quest.title}</QuestHeader>
		{objective && (
			<ObjectiveHeader>
				{action === 'complete' ? 'Completed: ' : 'Started: '}
				{objective.title}
			</ObjectiveHeader>
		)}

		<Description>{(objective || quest).text}</Description>
	</Modal>
)

const quest = new Audio('/sound/quest.mp3')

const QuestSplash = () => {
	const [splash, setSplash] = useState(null)
	const [animationState, setAnimationState] = useState('closed')
	const timer = useRef(null)

	useEffect(() => {
		clearTimeout(timer.current)

		switch (animationState) {
			case 'opening':
				quest.play()
				timer.current = setTimeout(setAnimationState, 5000, 'closing')
				break

			case 'closing':
				timer.current = setTimeout(setAnimationState, 5000, 'closed')
				break

			case 'closed':
				setSplash(null)
				break
		}
	}, [animationState])

	const ready = useSubscription('cards.all')

	useComputation(({ setSplash, setAnimationState, campaignId }) => {
		const notify = (id, action) => {
			const item = Cards.findOne(id)
			const quest =
				item.type === 'objective'
					? Cards.findOne({ type: 'quest', related: id })
					: item

			const objective = item.type === 'objective' ? item : null

			setSplash({ quest, objective, action })
			setAnimationState('opening')
		}

		let initial = true

		const computation = Cards.find({
			type: { $in: ['quest', 'objective'] },
			'access.view': { $gte: access.CAMPAIGN },
			campaignId,
		}).observeChanges({
			added(id) {
				if (!initial && ready) {
					notify(id, 'start')
				}
			},

			changed(id, { completed }) {
				if (!initial && ready && completed) {
					notify(id, 'complete')
				}
			},
		})

		initial = false
		return computation
	})

	return (
		<Portal isOpened={animationState !== 'closed'}>
			<Splash {...splash} animationState={animationState} />
		</Portal>
	)
}

export default QuestSplash
