import React, {Component} from 'react';
import formJson from '@quarterto/form-json';
import {H1, H2} from '../components/heading';
import Ornamented from '../components/ornamented';
import {createContainer} from 'meteor/react-meteor-data';
import getCampaignSession from '../../shared/session';
import {Cards} from '../../shared/collections'
import idFirst from '../id-first';
import OdreianDate from 'odreian-date';
import styled, {keyframes} from 'styled-components';
import {withCampaign} from '../components/campaign';
import {background} from '../colors';
import Portal from 'react-portal';

const fadeIn = keyframes`
	0% {
		opacity: 0;
		transform: scale(5);
	}

	100% {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	0%   { opacity: 1; }
	100% { opacity: 0; }
`;

const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${background};
	transform-origin: center;
	animation-name: ${
		({animationState}) => ({
			opening: fadeIn,
			closing: fadeOut,
		})[animationState] || 'none'
	};
	animation-duration: ${({animationState}) => animationState === 'opening' ? '200ms' : '5s'};
	animation-fill-mode: forwards;
	animation-timing-function: ${({animationState}) => animationState === 'opening' ? 'ease-out' : 'ease-in'};
	animation-iteration-count: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	text-align: center;
`;

const QuestHeader = styled.h1`
	font-family: "Libre Baskerville", sans-serif;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const ObjectiveHeader = styled.h1`
	font-family: "Source Sans Pro", sans-serif;
	font-weight: normal;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const QuestSplash = ({action, quest, objective, animationState}) => <Modal
	animationState={animationState}
>
	{action === 'startQuest' && <ObjectiveHeader>
		Started:
	</ObjectiveHeader>}
	<QuestHeader>
		<Ornamented ornament='u'>
			{quest.title}
		</Ornamented>
	</QuestHeader>
	{objective && <ObjectiveHeader>
		{action === 'completeObjective'
			? 'Completed: '
			: ''}
		{objective.title}
	</ObjectiveHeader>}
</Modal>;

const QuestSplashContainer = withCampaign(createContainer(({campaignId}) => ({
	splashQuest: getCampaignSession(campaignId).get('splashQuest'),
}), class extends Component {
	state = {
		splashQuest: null,
		animationState: 'closed',
	};

	componentWillReceiveProps(nextProps) {
		if(nextProps.splashQuest) {
			this.setState({
				splashQuest: nextProps.splashQuest,
				animationState: 'opening',
			});

			this.timer = setTimeout(() => {
				this.setState({animationState: 'closing'});

				this.timer = setTimeout(() => {
					this.setState({
						splashQuest: null,
						animationState: 'closed',
					});
				}, 5000);
			}, 10000);
		} else {
			this.setState({
				splashQuest: null,
				animationState: 'closed',
			});
		}
	}

	render() {
		if(this.state.splashQuest) {
			return <Portal isOpened={true}>
				<QuestSplash
					{...this.state.splashQuest}
					animationState={this.state.animationState}
				/>
			</Portal>;
		}

		return null
	}
}));

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
