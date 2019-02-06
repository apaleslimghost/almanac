import React from 'react'
import styled from 'styled-components'
import { compose, branch, withProps } from 'recompact'
import Ornamented from '../../visual/ornamented'
import { withCampaignDate } from '../../data/calendar'
import { withCampaignSession } from '../../data/campaign'
import withCards from '../../data/card'
import access from '../../../shared/access'
import questActions from './connect/quest'
import questsActions from './connect/quests'
import objectiveActions from './connect/objective'

import QuestSplash from './splash'

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`

const Large = styled.span`
	font-size: 1.2em;
`

const isControl = ({ control }) => control

const connectObjective = compose(
	withCampaignSession,
	withCampaignDate,
	objectiveActions
)

const Objective = connectObjective(
	({
		objective,
		quest,
		onCompleteObjective,
		onStartObjective,
		onDeleteObjective,
		control,
		CampaignDate
	}) => (
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
)

const withQuestObjectives = withCards('objectives', ({ quest, control }) => ({
	type: 'objective',
	_id: { $in: quest.related || [] },
	'access.view': { $gte: control ? access.PRIVATE : access.CAMPAIGN }
}))

const withQuestActions = branch(isControl, questActions)

const connectQuest = compose(
	withCampaignSession,
	withQuestObjectives,
	withQuestActions
)

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

const Quest = connectQuest(
	({
		quest,
		objectives,
		onCreateObjective,
		onStartQuest,
		onCompleteQuest,
		onDeleteQuest,
		onSelectQuest,
		currentQuest,
		control,
		first
	}) =>
		!control &&
		(quest.completed ||
			objectives.every(
				objective =>
					objective.completed || objective.access.view === access.PRIVATE
			)) ? null : (
			<div>
				<Ornamented ornament='u'>
					{quest.title}

					{control && (
						<>
							{currentQuest !== quest._id && (
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
							quest.text
						)}
				</Large>

				<ObjectiveList>
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

					{control && !quest.completed && (
						<li>
							<form onSubmit={onCreateObjective}>
								<input placeholder='Objective' name='title' />
								<input name='text' />
								<button type='submit'>➕</button>
							</form>
						</li>
					)}
				</ObjectiveList>
			</div>
		)
)

const withQuestsData = withCards(
	'quests',
	({ control }) => ({
		type: 'quest',
		'access.view': { $gte: control ? access.PRIVATE : access.CAMPAIGN }
	}),
	{
		sort: {
			updated: -1
		}
	}
)

const connectQuestsList = compose(
	withCampaignSession,
	withQuestsData
)

const QuestsList = connectQuestsList(
	({ onCreateQuest, control, quests, ...props }) => (
		<div>
			{quests.map((quest, index) => (
				<Quest
					key={quest._id}
					quest={quest}
					control={control}
					first={index === 0}
					{...props}
				/>
			))}
			{control && (
				<form onSubmit={onCreateQuest}>
					<input placeholder='Quest' name='title' />
					<input name='text' />
					<button type='submit'>➕</button>
				</form>
			)}
			{!control && <QuestSplash />}
		</div>
	)
)

const connectQuestControl = compose(
	withCampaignSession,
	questsActions,
	withProps({ control: true })
)

const QuestsControl = connectQuestControl(QuestsList)

export { QuestsList as display, QuestsControl as control }
