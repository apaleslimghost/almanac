import {lifecycle} from 'recompact';
import {Tracker} from 'meteor/tracker';

export default startComputation => lifecycle({
	componentDidMount() {
		process.nextTick(() => {
			Tracker.autorun(() => {
				this.computation = startComputation(this.props);
			});
		});
	},

	componentWillUnmount() {
		this.computation.stop();
	}
});
