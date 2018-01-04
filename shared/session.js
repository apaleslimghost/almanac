import {Session} from './collections';

export default campaignId => ({
	get(_key) {
		if(!campaignId) return null;

		const result = Session.findOne({
			campaignId,
			_key
		});

		return result ? result.data : null;
	},

	set(_key, data) {
		const existing = Session.findOne({
			campaignId,
			_key
		});

		if(campaignId) {
			if(existing) {
				Session.update(existing._id, {$set: {data}});
			} else {
				Session.insert({data, campaignId, _key});
			}
		} else {
			console.trace('No campaign id');
		}
	},
});
