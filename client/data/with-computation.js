import { Tracker } from 'meteor/tracker'
import { useTracker } from 'meteor/quarterto:hooks'
import { lifecycle } from 'recompact'

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
		},
	})

export const useComputation = (startComputation, dependencies = []) =>
	useTracker(() => {
		let computation

		process.nextTick(() => {
			Tracker.autorun(() => {
				computation = startComputation()
			})
		})

		return () => computation.stop()
	}, dependencies)
