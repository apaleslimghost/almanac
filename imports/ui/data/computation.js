import { Tracker } from 'meteor/tracker'
import { useTracker } from '../utils/hooks'

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
