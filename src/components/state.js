import {Component} from 'react';

const withState = (getDefaultState, component) => class StatefulComponent extends Component {
	constructor(props) {
		super(props);
		this.state = typeof getDefaultState === 'function' ? getDefaultState(props) : getDefaultState;
	}

	componentWillReceiveProps(nextProps) {
		this.setState(typeof getDefaultState === 'function' ? getDefaultState(nextProps) : getDefaultState);
	}

	render() {
		return component(this.props, this.state, this.setState.bind(this));
	}
}

export default withState;