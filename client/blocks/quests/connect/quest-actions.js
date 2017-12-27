import {Cards} from '../../../../shared/collections';
import {withHandlers} from 'recompose';
import formJson from '@quarterto/form-json';

const questActions = withHandlers({
	onDeleteQuest: ({quest}) => ev => {
		Cards.remove(quest._id);
		Cards.find({
			type: 'objective',
			_id: {$in: quest.related || []}
		}).forEach(({_id}) => {
			Cards.remove(_id);
		});
	},

	onSelectQuest: ({quest, campaignSession}) => ev => {
		campaignSession.set('currentQuest', quest._id);
	},

	onCreateObjective: ({quest, campaignId, campaignSession}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Cards.insert({
			...data,
			completed: false,
			type: 'objective',
			campaignId,
		}, (err, id) => {
			if(err) return;
			Cards.update(
				quest._id,
				{$addToSet: {related: id}}
			);

			campaignSession.set('splashQuest', {
				action: 'startObjective',
				quest,
				objective: data,
			});
		});
	},
});

export default questActions;
