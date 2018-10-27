import {withHandlers} from 'recompact';
import formJson from '@quarterto/form-json';
import {deleteCardWithRelated, Card, addRelated} from '../../../../shared/methods';
import access from '../../../../shared/access';

const questActions = withHandlers({
	onDeleteQuest: ({quest}) => ev => {
		deleteCardWithRelated(quest, {ofType: 'objective'});
	},

	onSelectQuest: ({quest, campaignSession}) => ev => {
		campaignSession.set('currentQuest', quest._id);
	},

	onCreateObjective: ({quest, campaignId, campaignSession}) => async ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		const objective = await Card.create({
			...data,
			completed: false,
			type: 'objective',
			campaignId,
			access: {edit: access.PRIVATE, view: access.PRIVATE},
		});

		addRelated(quest, objective);
	},
});

export default questActions;
