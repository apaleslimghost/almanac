import {withHandlers} from 'recompact';
import {Card} from '../../../../../shared/imports/methods';

const objectiveActions = withHandlers({
	onCompleteObjective: ({objective, quest, campaignSession}) => ev => {
		Card.update(objective, {
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
		Card.delete(objective);
	},
});

export default objectiveActions;
