import React from 'react'
import styled from 'styled-components'
import Ornamented from '../../visual/ornamented'
import { useCampaignDate } from '../../data/calendar'
import { useCampaignSession, useCampaignId } from '../../data/campaign'
import { useCards } from '../../data/card'
import access from '../../../lib/access'
import formJson from '@quarterto/form-json'
import { deleteCardWithRelated, Card, addRelated } from '../../../lib/methods'
import Markdown from '../../document/markdown'

import QuestSplash from './splash'

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`

const Large = styled(Markdown)`
	font-size: 1.2em;
`

const Objective = ({ objective, quest, control }) => {
	const CampaignDate = useCampaignDate()
	const campaignSession = useCampaignSession()

	function onCompleteObjective() {
		Card.update(objective, {
			completed: true,
			completedDate: campaignSession.get('date') || 0,
		})
	}

	function onStartObjective() {
		Card.update(objective, {
			'access.view': access.CAMPAIGN,
		})
	}

	function onDeleteObjective() {
		if (confirm(`Delete ${objective.title} from ${quest.title}?`)) {
			Card.delete(objective)
		}
	}

	return (
		<>
			{control && (
				<>
					{!objective.completed && objective.access.view > access.PRIVATE && (
						<button type='button' onClick={onCompleteObjective}>
							☑️
						</button>
					)}

					{objective.access.view === access.PRIVATE &&
						quest.access.view > access.PRIVATE && (
							<button type='button' onClick={onStartObjective}>
								👁
							</button>
						)}

					<button type='button' onClick={onDeleteObjective}>
						❌
					</button>
				</>
			)}

			{objective.completed ? <s>{objective.title}</s> : objective.title}

			{objective.completed && (
				<Completed>
					{new CampaignDate(objective.completedDate)
						.format`${'h'}:${'mm'}${'a'}, ${'dddd'}, ${'Do'} of ${'MM'}, ${'YY'}`}
				</Completed>
			)}
		</>
	)
}

const m = (a, b, c) => (a ? b(a) || c : c)

const ObjectiveList = styled.ul`
	margin: 1em 0;
	padding: 0;
	list-style: none;
`

const ObjectiveListItem = styled.li`
	&::before {
		content: '${({ completed, first }) => (completed ? '✕' : first ? '❖' : '◆')}';
		margin-right: 0.25em;
	}
`

const Quest = ({ quest, control, first }) => {
	const campaignId = useCampaignId()
	const campaignSession = useCampaignSession()

	const { cards: objectives } = useCards(
		{
			type: 'objective',
			_id: { $in: quest.related || [] },
			'access.view': { $gte: control ? access.PRIVATE : access.CAMPAIGN },
		},
		{
			deps: [quest.related],
		},
	)

	function onDeleteQuest() {
		if (confirm(`Delete ${quest.title} and all objectives?`)) {
			deleteCardWithRelated(quest, { ofType: 'objective' })
		}
	}

	function onCompleteQuest() {
		Card.update(quest, {
			completed: true,
			completedDate: campaignSession.get('date') || 0,
		})
	}

	function onSelectQuest() {
		Card.update(quest, {
			updated: new Date(),
		})
	}

	function onStartQuest() {
		Card.update(quest, {
			'access.view': access.CAMPAIGN,
		})
	}

	async function onCreateObjective(ev) {
		ev.preventDefault()
		const data = formJson(ev.target)
		ev.target.reset()

		const objective = await Card.create({
			...data,
			completed: false,
			type: 'objective',
			campaignId,
			access: { edit: access.PRIVATE, view: access.PRIVATE },
		})

		addRelated(quest, objective)
	}

	return !control &&
		(quest.completed ||
			objectives.every(
				objective =>
					objective.completed || objective.access.view === access.PRIVATE,
			)) ? null : (
		<div>
			<Ornamented ornament='u'>
				{quest.completed ? <s>{quest.title}</s> : quest.title}

				{control && (
					<>
						{!first && (
							<button type='button' onClick={() => onSelectQuest(quest)}>
								🔝
							</button>
						)}

						{!quest.completed && quest.access.view > access.PRIVATE && (
							<button type='button' onClick={onCompleteQuest}>
								☑️
							</button>
						)}

						{quest.access.view === access.PRIVATE && (
							<button type='button' onClick={onStartQuest}>
								👁
							</button>
						)}

						{
							<button type='button' onClick={onDeleteQuest}>
								❌
							</button>
						}
					</>
				)}
			</Ornamented>

			<Large>
				{first &&
					m(
						objectives.find(({ completed }) => !completed),
						objective => objective.text,
						quest.text,
					)}
			</Large>

			<ObjectiveList>
				{control && !quest.completed && (
					<li>
						<form onSubmit={onCreateObjective}>
							<input placeholder='Objective' name='title' />
							<input name='text' />
							<button type='submit'>➕</button>
						</form>
					</li>
				)}
				{objectives
					.filter(({ completed }) => !completed)
					.map((objective, index) => (
						<ObjectiveListItem key={objective._id} first={index === 0}>
							<Objective
								quest={quest}
								objective={objective}
								control={control}
							/>
						</ObjectiveListItem>
					))}

				{objectives
					.filter(({ completed }) => completed)
					.map(objective => (
						<ObjectiveListItem key={objective._id} completed>
							<Objective
								quest={quest}
								objective={objective}
								control={control}
							/>
						</ObjectiveListItem>
					))}
			</ObjectiveList>
		</div>
	)
}

const QuestsList = ({ control, ...props }) => {
	const campaignId = useCampaignId()
	const { ready, cards: quests } = useCards(
		{
			type: 'quest',
			'access.view': { $gte: control ? access.PRIVATE : access.CAMPAIGN },
		},
		{
			sort: {
				completed: 1,
				updated: -1,
			},
		},
	)

	function onCreateQuest(ev) {
		ev.preventDefault()
		const data = formJson(ev.target)
		ev.target.reset()

		Card.create({
			...data,
			type: 'quest',
			campaignId,
			access: { edit: access.PRIVATE, view: access.PRIVATE },
		})
	}

	return (
		<div>
			{control && (
				<form onSubmit={onCreateQuest}>
					<input placeholder='Quest' name='title' />
					<input name='text' />
					<button type='submit'>➕</button>
				</form>
			)}
			{ready &&
				quests.map((quest, index) => (
					<Quest
						key={quest._id}
						quest={quest}
						control={control}
						first={index === 0}
						{...props}
					/>
				))}
			{!control && <QuestSplash />}
		</div>
	)
}

const QuestsControl = props => <QuestsList {...props} control />

export { QuestsList as display, QuestsControl as control }
