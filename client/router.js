import {route_} from 'boulevard';
import {history, link, navigate, start} from 'meteor/quarterto:reactive-history';

export {link};
export const go = navigate;

const router = route_({
	getUrl() {
		return history.get();
	},

	addParams(params) {
		return [params];
	},

	fourOhFour() {
		return <h1>
			${history.get()} not found
		</h1>;
	}
});

export default routes => {
	const route = router(routes);
	start();

	Tracker.autorun(() => route());
};
