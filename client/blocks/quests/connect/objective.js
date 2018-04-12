import {Cards} from '../../../../shared/collections';
import {withHandlers} from 'recompose';

const objectiveActions = withHandlers({
	onCompleteObjective: ({objective, quest, campaignSession}) => ev => {
		Meteor.call('updateCard', objective, {
			completed: true,
			completedDate: campaignSession.get('date') || 0,
		});

		campaignSession.set('splashQuest', {
			action: 'completeObjective',
			quest,
			objective,
		});
	},

	onDeleteObjective: ({objective}) => ev => {
		Meteor.call('deleteCard', objective);
	},
});

export default objectiveActions;
