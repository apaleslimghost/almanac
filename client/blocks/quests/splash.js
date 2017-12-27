import React, {Component} from 'react';
import styled from 'styled-components';
import {compose} from 'recompose';
import Portal from 'react-portal';
import {withTracker} from 'meteor/react-meteor-data';
import Modal from '../../components/presentation/modal';
import {withCampaignSession} from '../../components/campaign';
import Ornamented from '../../components/ornamented';

const QuestHeader = styled.h1`
	font-family: "Libre Baskerville", sans-serif;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const ObjectiveHeader = styled.h1`
	font-family: "Source Sans Pro", sans-serif;
	font-weight: 300;
	font-size: 5em;
	margin: 0;
	line-height: 1;
`;

const Splash = ({action, quest, objective, animationState}) => <Modal
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

const withSplashQuest = withTracker(({campaignSession}) => ({
	splashQuest: campaignSession.get('splashQuest'),
}));

const connectQuestSplash = compose(
	withCampaignSession,
	withSplashQuest
);

class QuestSplash extends Component {
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
					this.props.campaignSession.set('splashQuest', null);
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
				<Splash
					{...this.state.splashQuest}
					animationState={this.state.animationState}
				/>
			</Portal>;
		}

		return null
	}
}

export default connectQuestSplash(QuestSplash);
