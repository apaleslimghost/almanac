import { Tracker } from 'meteor/tracker'
import { useTracker } from 'meteor/quarterto:hooks'

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
