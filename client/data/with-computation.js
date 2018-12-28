import {Tracker} from 'meteor/tracker'
import {lifecycle} from 'recompact'

export default startComputation =>
	lifecycle({
		componentDidMount() {
			process.nextTick(() => {
				Tracker.autorun(() => {
					this.computation = startComputation(this.props)
				})
			})
		},

		componentWillUnmount() {
			this.computation.stop()
		}
	})
