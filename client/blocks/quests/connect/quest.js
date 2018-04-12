import {Cards} from '../../../../shared/collections';
import {withHandlers} from 'recompose';
import formJson from '@quarterto/form-json';
import generateSlug from '../../../../shared/utils/generate-slug';

const questActions = withHandlers({
	onDeleteQuest: ({quest}) => ev => {
		Meteor.call('deleteCardWithRelated', quest, {ofType: 'objective'});
	},

	onSelectQuest: ({quest, campaignSession}) => ev => {
		campaignSession.set('currentQuest', quest._id);
	},

	onCreateObjective: ({quest, campaignId, campaignSession}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Meteor.call('createCard', {
			...data,
			completed: false,
			type: 'objective',
			campaignId,
		}, (err, objective) => {
			if(err) return;

			Meteor.call('addRelated', quest, objective);

			campaignSession.set('splashQuest', {
				action: 'startObjective',
				quest,
				objective,
			});
		});
	},
});

export default questActions;
