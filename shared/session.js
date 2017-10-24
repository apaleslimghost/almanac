import {Session} from './collections';

export default ({campaignId}) => ({
	get(_key) {
		return Session.findOne({
			campaignId,
			_key
		});
	},

	set(_key, obj) {
		const existing = this.get(_key);
		if(existing) {
			Session.update(existing._id, {$set: obj});
		} else {
			Session.insert({...obj, campaignId, _key});
		}
	},
});
