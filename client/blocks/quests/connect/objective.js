import {withHandlers} from 'recompact';
import {Card} from '../../../../shared/methods';
import access from '../../../../shared/access';

const objectiveActions = withHandlers({
	onCompleteObjective: ({objective, campaignSession}) => ev => {
		Card.update(objective, {
			completed: true,
			completedDate: campaignSession.get('date') || 0,
		});
	},

	onStartObjective: ({objective}) => ev => {
		Card.update(objective, {
			'access.view': access.CAMPAIGN,
		});
	},

	onDeleteObjective: ({objective, quest}) => ev => {
		confirm(`Delete ${objective.title} from ${quest.title}?`) && Card.delete(objective);
	},
});

export default objectiveActions;
