import {route_} from 'boulevard';
import {history} from 'meteor/quarterto:reactive-history';

export default route_({
	getUrl() {
		return history.get();
	},

	fourOhFour() {
		return <h1>{history.get()} not found</h1>;
	},
});
