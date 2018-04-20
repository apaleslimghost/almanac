import {withHandlers} from 'recompact';
import formJson from '@quarterto/form-json';
import generateSlug from '../../../../shared/utils/generate-slug';
import {deleteCardWithRelated, createCard, addRelated} from '../../../../shared/methods';

const questActions = withHandlers({
	onDeleteQuest: ({quest}) => ev => {
		deleteCardWithRelated(quest, {ofType: 'objective'});
	},

	onSelectQuest: ({quest, campaignSession}) => ev => {
		campaignSession.set('currentQuest', quest._id);
	},

	onCreateObjective: ({quest, campaignId, campaignSession}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		createCard({
			...data,
			completed: false,
			type: 'objective',
			campaignId,
		}, (err, objective) => {
			if(err) return;

			addRelated(quest, objective);

			campaignSession.set('splashQuest', {
				action: 'startObjective',
				quest,
				objective,
			});
		});
	},
});

export default questActions;
