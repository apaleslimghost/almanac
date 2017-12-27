import {Cards} from '../../../../shared/collections';
import {withHandlers} from 'recompose';

const objectiveActions = withHandlers({
	onCompleteObjective: ({objective, quest, campaignSession}) => ev => {
		Cards.update(objective._id, {
			$set: {
				completed: true,
				completedDate: campaignSession.get('date') || 0,
			},
		});

		campaignSession.set('splashQuest', {
			action: 'completeObjective',
			quest,
			objective,
		});
	},

	onDeleteObjective: ({objective}) => ev => {
		Cards.remove(objective._id);
	},
});

export default objectiveActions;
