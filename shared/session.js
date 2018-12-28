import { Session } from './collections'
import { setSession } from './methods'

export default campaignId => ({
	get(_key) {
		if (!campaignId) return null

		const result = Session.findOne({
			campaignId,
			_key
		})

		return result ? result.data : null
	},

	set(_key, data) {
		setSession(campaignId, _key, data)
	}
})
