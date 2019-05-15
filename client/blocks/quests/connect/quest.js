import { withHandlers } from 'recompact'
import formJson from '@quarterto/form-json'
import {
	deleteCardWithRelated,
	Card,
	addRelated
} from '../../../../shared/methods'
import access from '../../../../shared/access'

const questActions = withHandlers({
	onDeleteQuest: ({ quest }) => () => {
		if (confirm(`Delete ${quest.title} and all objectives?`)) {
			deleteCardWithRelated(quest, { ofType: 'objective' })
		}
	},

	onCompleteQuest: ({ quest, campaignSession }) => () => {
		Card.update(quest, {
			completed: true,
			completedDate: campaignSession.get('date') || 0
		})
	},

	onSelectQuest: ({ quest }) => () => {
		Card.update(quest, {
			updated: new Date()
		})
	},

	onStartQuest: ({ quest }) => () => {
		Card.update(quest, {
			'access.view': access.CAMPAIGN
		})
	},

	onCreateObjective: ({ quest, campaignId }) => async ev => {
		ev.preventDefault()
		const data = formJson(ev.target)
		ev.target.reset()

		const objective = await Card.create({
			...data,
			completed: false,
			type: 'objective',
			campaignId,
			access: { edit: access.PRIVATE, view: access.PRIVATE }
		})

		addRelated(quest, objective)
	}
})

export default questActions
