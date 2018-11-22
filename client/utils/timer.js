import {lifecycle} from 'recompact'

export default (interval, onFire) =>
	lifecycle({
		componentDidMount() {
			this.timer = setInterval(() => onFire(this.props), interval)
		},

		componentWillUnmount() {
			clearInterval(this.timer)
		}
	})
