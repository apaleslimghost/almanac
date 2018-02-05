import {lifecycle} from 'recompose';

export default (interval, onFire) => lifecycle({
	componentDidMount() {
		this.timer = setInterval(() => onFire(this.props), interval);
	},

	componentWillUnmount() {
		clearInterval(this.timer);
	}
});
