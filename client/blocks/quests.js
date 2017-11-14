import React from 'react';
import formJson from '@quarterto/form-json';
import {H1, H2} from '../components/heading';
import Ornamented from '../components/ornamented';
import {createContainer} from 'meteor/react-meteor-data';
import getCampaignSession from '../../shared/session';
import {Cards} from '../../shared/collections'
import idFirst from '../id-first';
import OdreianDate from 'odreian-date';
import styled from 'styled-components';
import {withCampaign} from '../components/campaign';
import {background} from '../colors';
import Portal from 'react-portal';

const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${background};
`;

const QuestSplash = ({action, quest, objective}) => quest ? <div>
	<H1>
		{action === 'startQuest' ? 'Started: ' : ''}
		{quest.title}
	</H1>
	{objective && <H2>
		{action === 'completeObjective'
			? 'Completed: '
			: ''}
		{objective.title}
	</H2>}
</div> : null;

const QuestSplashContainer = withCampaign(createContainer(({campaignId}) => ({
	splashQuest: getCampaignSession(campaignId).get('splashQuest'),
}), ({splashQuest}) => splashQuest
	? <Portal isOpened={true}>
		<Modal><QuestSplash {...splashQuest} /></Modal>
	</Portal>
	: null
));

const Completed = styled.span`
	float: right;
	font-size: 0.7em;
`;

const getQuestObjectives = ({quest, campaignId}) => Cards.find({
	type: 'objective',
	_id: {$in: quest.related || []},
	campaignId,
}).fetch();

const ObjectivesList = withCampaign(createContainer(({quest, campaignId}) => ({
	objectives: getQuestObjectives({quest, campaignId}),
}), ({
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
));

const QuestsList = withCampaign(createContainer(({currentQuest, campaignId}) => ({
	quests: idFirst(
		Cards.find({type: 'quest', campaignId}).fetch(),
		currentQuest
	),
}), ({onCreateQuest, quests, ...props}) => <div>
	{quests.map(quest => <ObjectivesList key={quest._id} quest={quest} {...props} />)}
	{onCreateQuest && <form onSubmit={onCreateQuest}>
		<input placeholder='Quest' name='title' />
		<button>➕</button>
	</form>}
	{!onCreateQuest && <QuestSplashContainer />}
</div>));

const QuestsControl = withCampaign(createContainer(({campaignId}) => {
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
}, QuestsList));

export {
	QuestsList as display,
	QuestsControl as control
};
