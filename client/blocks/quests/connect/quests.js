import {Cards} from '../../../../shared/collections';
import {withHandlers} from 'recompose';
import formJson from '@quarterto/form-json';

const questsActions = withHandlers({
	onCreateQuest: ({campaignId, campaignSession}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Cards.insert({
			...data,
			type: 'quest',
			campaignId,
		});

		campaignSession.set('splashQuest', {
			action: 'startQuest',
			quest: data,
		});
	},
});

export default questsActions;
