import { withHandlers } from 'recompact'
import { Card } from '../../../../shared/methods'
import access from '../../../../shared/access'

const objectiveActions = withHandlers({
	onCompleteObjective: ({ objective, campaignSession }) => () => {
		Card.update(objective, {
			completed: true,
			completedDate: campaignSession.get('date') || 0,
		})
	},

	onStartObjective: ({ objective }) => () => {
		Card.update(objective, {
			'access.view': access.CAMPAIGN,
		})
	},

	onDeleteObjective: ({ objective, quest }) => () => {
		if (confirm(`Delete ${objective.title} from ${quest.title}?`)) {
			Card.delete(objective)
		}
	},
})

export default objectiveActions
