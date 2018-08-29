import React, {Component} from 'react';
import {H1, H2} from '../../visual/heading';
import Ornamented from '../../visual/ornamented';
import {withTracker} from 'meteor/react-meteor-data';
import {Cards} from '../../../../shared/imports/collections';
import idFirst from '../../utils/id-first';
import {withCampaignDate} from '../../data/calendar';
import styled, {keyframes} from 'styled-components';
import {withCampaign, withCampaignSession} from '../../data/campaign';
import {compose, branch, withProps} from 'recompact';
import questActions from './connect/quest';
import questsActions from './connect/quests';
import objectiveActions from './connect/objective';
import withCards from '../../data/card';

import QuestSplash from './splash';

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`;

const isControl = ({control}) => control;

const connectObjective = compose(
	withCampaignSession,
	withCampaignDate,
	objectiveActions
);

const Objective = connectObjective(({
	objective, quest, onCompleteObjective, onDeleteObjective, control, CampaignDate
}) => <div>
	{control && !objective.completed &&
		<button onClick={onCompleteObjective}>
			☑️
		</button>
	}

	{control &&
		<button onClick={onDeleteObjective}>
			❌
		</button>
	}

	{objective.completed
		? <s>{objective.title}</s>
		: objective.title
	}

	{objective.completed && <Completed>
		{new CampaignDate(objective.completedDate).format`${'h'}:${'mm'}${'a'}, ${'dddd'}, ${'Do'} of ${'MM'}, ${'YY'}`}
	</Completed>}
</div>);

const withQuestObjectives = withCards(
	'objectives',
	({quest}) => ({
		type: 'objective',
		_id: {$in: quest.related || []},
	})
);

const withQuestActions = branch(
	isControl,
	questActions
);

const connectQuest = compose(
	withCampaignSession,
	withQuestObjectives,
	withQuestActions
);

const Quest = connectQuest(({
	quest,
	objectives,
	onCreateObjective,
	onDeleteQuest,
	onSelectQuest,
	currentQuest,
	control,
}) =>
	objectives.length > 0 || control ? <div>
		<Ornamented ornament='u'>
			{quest.title}
			{control && currentQuest !== quest._id &&
				<button onClick={() => onSelectQuest(quest)}>🔝</button>}
			{control && <button onClick={onDeleteQuest}>❌</button>}
		</Ornamented>

		<ul>
			{objectives.filter(({completed}) => !completed).map(objective => <li key={objective._id}>
				<Objective quest={quest} objective={objective} control={control} />
			</li>)}

			{objectives.filter(({completed}) => completed).map(objective => <li key={objective._id}>
				<Objective quest={quest} objective={objective} control={control} />
			</li>)}

			{control && <li>
				<form onSubmit={onCreateObjective}>
					<input placeholder='Objective' name='title' />
					<button>➕</button>
				</form>
			</li>}
		</ul>
	</div> : null
);

const withQuestsData = withCards('quests', {type: 'quest'});

const withCurrentQuest = withTracker(({quests, campaignSession}) => {
	const currentQuest = campaignSession.get('currentQuest');

	return {
		currentQuest,
		quests: idFirst(quests, currentQuest),
	};
});

const connectQuestsList = compose(
	withCampaignSession,
	withQuestsData,
	withCurrentQuest
);

const QuestsList = connectQuestsList(({onCreateQuest, control, quests, ...props}) => <div>
	{quests.map(quest => <Quest key={quest._id} quest={quest} control={control} {...props} />)}
	{control && <form onSubmit={onCreateQuest}>
		<input placeholder='Quest' name='title' />
		<button>➕</button>
	</form>}
	{!control && <QuestSplash />}
</div>);

const connectQuestControl = compose(
	withCampaignSession,
	questsActions,
	withProps({control: true})
);

const QuestsControl = connectQuestControl(QuestsList);

export {
	QuestsList as display,
	QuestsControl as control
};
