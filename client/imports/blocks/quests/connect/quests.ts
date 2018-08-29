import {withHandlers} from 'recompact';
import formJson from '@quarterto/form-json';
import {Card} from '../../../../../shared/imports/methods';

const questsActions = withHandlers({
	onCreateQuest: ({campaignId, campaignSession}) => ev => {
		ev.preventDefault();
		const data = formJson(ev.target);
		ev.target.reset();

		Card.create({
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
