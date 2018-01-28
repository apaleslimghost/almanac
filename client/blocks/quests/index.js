import React, {Component} from 'react';
import {H1, H2} from '../../components/visual/heading';
import Ornamented from '../../components/visual/ornamented';
import {withTracker} from 'meteor/react-meteor-data';
import getCampaignSession from '../../../shared/session';
import {Cards} from '../../../shared/collections'
import idFirst from '../../id-first';
import OdreianDate from 'odreian-date';
import styled, {keyframes} from 'styled-components';
import {withCampaign, withCampaignSession} from '../../components/collection/campaign';
import {compose, branch, withProps} from 'recompose';
import questActions from './connect/quest';
import questsActions from './connect/quests';
import objectiveActions from './connect/objective';
import withCards from '../../components/data/card';

import QuestSplash from './splash';

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`;

const isControl = ({control}) => control;

const connectObjective = compose(
	withCampaignSession,
	objectiveActions
);

const Objective = connectObjective(({
	objective, quest, onCompleteObjective, onDeleteObjective, control
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
		{new OdreianDate(objective.completedDate).format`${'llll'}`}
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

const withQuestsData = withTracker(({campaignId, campaignSession}) => {
	const currentQuest = campaignSession.get('currentQuest');
	return {
		currentQuest,
		quests: idFirst(
			// TODO: use withCard
			Cards.find({type: 'quest', campaignId}).fetch(),
			currentQuest
		),
	};
});

const connectQuestsList = compose(
	withCampaignSession,
	withQuestsData
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
