import React, {Component} from 'react';
import styled from 'styled-components';
import {compose, withState, withPropsOnChange} from 'recompact';
import Portal from 'react-portal';
import {withTracker} from 'meteor/react-meteor-data';
import Modal from '../../visual/modal';
import {withCampaignSession} from '../../data/campaign';
import Ornamented from '../../visual/ornamented';
import {Cards} from '../../../shared/collections';
import withComputation from '../../data/with-computation';
import access from '../../../shared/access';
import subscribe from '../../utils/subscribe';
import {toast} from 'react-toastify';

const QuestHeader = styled(Ornamented)`
	font-family: "Libre Baskerville", sans-serif;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const ObjectiveHeader = styled.h2`
	font-family: "Source Sans Pro", sans-serif;
	font-weight: 300;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const Splash = ({action, quest, objective, animationState}) => <Modal
	animationState={animationState}
>
	{!objective && <ObjectiveHeader>
		{action === 'complete'
			? 'Completed:'
			: 'Started:'}
	</ObjectiveHeader>}
	<QuestHeader ornament='u'>
		{quest.title}
	</QuestHeader>
	{objective && <ObjectiveHeader>
		{action === 'complete'
			? 'Completed: '
			: 'Started: '}
		{objective.title}
	</ObjectiveHeader>}
</Modal>;

const withQuestChanges = withComputation(({setSplash, setAnimationState}) => {
	subscribe('cards.all');

	const notify = (id, action) => {
		const item = Cards.findOne(id);
		const quest = item.type === 'objective'
			? Cards.findOne({ type: 'quest', related: id })
			: item;

		const objective = item.type === 'objective'
			? item
			: null;

		setSplash({quest, objective, action});
		setAnimationState('opening');
	}

	let initial = true;
	const computation = Cards.find({
		type: {$in: ['quest', 'objective']},
		'access.view': {$gte: access.CAMPAIGN},
	}).observeChanges({
		added(id) {
			if(!initial) {
				notify(id, 'start');
			}
		},

		changed(id, {completed}) {
			if(completed) {
				notify(id, 'complete');
			}
		},
	})

	initial = false;
	return computation;
});

const quest = new Audio('/sound/quest.mp3');

const connectQuestSplash = compose(
	withState('splash', 'setSplash', null),
	withState('animationState', 'setAnimationState', 'closed'),
	withPropsOnChange(['animationState'], ({animationState, setAnimationState, setSplash}) => {
		switch(animationState) {
			case 'opening':
				quest.play();
				setTimeout(setAnimationState, 5000, 'closing');
				break;

			case 'closing':
				setTimeout(setAnimationState, 5000, 'closed');
				break;

			case 'closed':
				setSplash(null);
				break;
		}
	}),
	withQuestChanges,
);

const QuestSplash = ({animationState, splash}) => <Portal isOpened={animationState !== 'closed'}>
	<Splash
		{...splash}
		animationState={animationState}
	/>
</Portal>;

export default connectQuestSplash(QuestSplash);
