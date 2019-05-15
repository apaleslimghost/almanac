import { withHandlers } from 'recompact'
import formJson from '@quarterto/form-json'
import { Card } from '../../../../shared/methods'
import access from '../../../../shared/access'

const questsActions = withHandlers({
	onCreateQuest: ({ campaignId }) => ev => {
		ev.preventDefault()
		const data = formJson(ev.target)
		ev.target.reset()

		Card.create({
			...data,
			type: 'quest',
			campaignId,
			access: { edit: access.PRIVATE, view: access.PRIVATE }
		})
	}
})

export default questsActions
