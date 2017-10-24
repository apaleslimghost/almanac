import SyncedSession from 'meteor/quarterto:synced-session';

export default prefix => ({
	get(key) {
		return SyncedSession.get(prefix + key);
	},

	set(key, obj) {
		SyncedSession.get(prefix + key, obj);
	},
});
