import React, {Component} from 'react';
import formJson from '@quarterto/form-json';
import {H1, H2} from '../../components/heading';
import Ornamented from '../../components/ornamented';
import {withTracker} from 'meteor/react-meteor-data';
import getCampaignSession from '../../../shared/session';
import {Cards} from '../../../shared/collections'
import idFirst from '../../id-first';
import OdreianDate from 'odreian-date';
import styled, {keyframes} from 'styled-components';
import {withCampaign} from '../../components/campaign';
import {compose} from 'recompose';

import QuestSplash from './splash';

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`;

const withQuestObjectives = withTracker(({quest, campaignId}) => ({
	objectives: Cards.find({
		type: 'objective',
		_id: {$in: quest.related || []},
		campaignId,
	}).fetch(),
}));

const connectObjectivesList = compose(
	withCampaign,
	withQuestObjectives
);

const ObjectivesList = connectObjectivesList(({
	quest,
	objectives,
	onCompleteObjective,
	onDeleteObjective,
	onCreateObjective,
	onDeleteQuest,
	onSelectQuest,
	currentQuest,
}) =>
	objectives.length > 0 || onCreateObjective ? <div>
		<Ornamented ornament='u'>
			{quest.title}
			{onSelectQuest && currentQuest !== quest._id &&
				<button onClick={() => onSelectQuest(quest)}>🔝</button>}
			{onDeleteQuest && <button onClick={() => onDeleteQuest(quest)}>❌</button>}
		</Ornamented>

		<ul>
			{objectives.filter(({completed}) => !completed).map(objective =>
				<li key={objective._id}>
					{onCompleteObjective &&
						<button onClick={() => onCompleteObjective(objective, quest)}>
							☑️
						</button>
					}
					{onDeleteObjective &&
						<button onClick={() => onDeleteObjective(objective)}>
							❌
						</button>
					}
					{objective.title}
				</li>
			)}
			{objectives.filter(({completed}) => completed).map(objective =>
				<li key={objective._id}>
					{onDeleteObjective &&
						<button onClick={() => onDeleteObjective(objective)}>
							❌
						</button>
					}
					<s>{objective.title}</s>
					<Completed>
						{new OdreianDate(objective.completedDate).format`${'llll'}`}
					</Completed>
				</li>
			)}
			{onCreateObjective && <li>
				<form onSubmit={ev => onCreateObjective(ev, quest)}>
					<input placeholder='Objective' name='title' />
					<button>➕</button>
				</form>
			</li>}
		</ul>
	</div> : null
);

const withQuestsData = withTracker(({currentQuest, campaignId}) => ({
	quests: idFirst(
		Cards.find({type: 'quest', campaignId}).fetch(),
		currentQuest
	),
}));

const connectQuestsList = compose(
	withCampaign,
	withQuestsData
);

const QuestsList = connectQuestsList(({onCreateQuest, quests, ...props}) => <div>
	{quests.map(quest => <ObjectivesList key={quest._id} quest={quest} {...props} />)}
	{onCreateQuest && <form onSubmit={onCreateQuest}>
		<input placeholder='Quest' name='title' />
		<button>➕</button>
	</form>}
	{!onCreateQuest && <QuestSplash />}
</div>);

const withQuestControl = withTracker(({campaignId}) => {
	const session = getCampaignSession(campaignId);
	const currentQuest = session.get('currentQuest');

	return {
		currentQuest,

		onCompleteObjective(objective, quest) {
			Cards.update(objective._id, {
				$set: {
					completed: true,
					completedDate: session.get('date') || 0,
				},
			});

			session.set('splashQuest', {
				action: 'completeObjective',
				quest,
				objective,
			});
		},

		onDeleteObjective(objective) {
			Cards.remove(objective._id);
		},

		onCreateObjective(ev, quest) {
			ev.preventDefault();
			const data = formJson(ev.target);
			ev.target.reset();

			Cards.insert({
				...data,
				completed: false,
				type: 'objective',
				campaignId,
			}, (err, id) => {
				if(err) return;
				Cards.update(
					quest._id,
					{$addToSet: {related: id}}
				);

				session.set('splashQuest', {
					action: 'startObjective',
					quest,
					objective: data,
				});
			});
		},

		onCreateQuest(ev) {
			ev.preventDefault();
			const data = formJson(ev.target);
			ev.target.reset();

			Cards.insert({
				...data,
				type: 'quest',
				campaignId,
			});

			session.set('splashQuest', {
				action: 'startQuest',
				quest: data,
			});
		},

		onDeleteQuest(quest) {
			Cards.remove(quest._id);
			Cards.find({
				type: 'objective',
				_id: {$in: quest.related || []}
			}).forEach(({_id}) => {
				Cards.remove(_id);
			});
		},

		onSelectQuest(quest) {
			session.set('currentQuest', quest._id);
		}
	};
});

const connectQuestControl = compose(
	withCampaign,
	withQuestControl
);

const QuestsControl = connectQuestControl(QuestsList);

export {
	QuestsList as display,
	QuestsControl as control
};
