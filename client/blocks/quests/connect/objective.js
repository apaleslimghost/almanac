import {withHandlers} from 'recompact';
import {updateCard, deleteCard} from '../../../../shared/methods';

const objectiveActions = withHandlers({
	onCompleteObjective: ({objective, quest, campaignSession}) => ev => {
		updateCard(objective, {
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
		deleteCard(objective);
	},
});

export default objectiveActions;
