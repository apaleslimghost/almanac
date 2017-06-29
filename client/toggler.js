import React, {Component} from 'react';

class Toggler extends Component {
	constructor(...args) {
		super(...args);
		this.state = {on: false};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState(({on}) => ({on: !on}));
	}

	render() {
		return this.state.on
			? <this.props.active toggle={this.toggle} {...this.props} />
			: <this.props.inactive toggle={this.toggle} {...this.props} />;
	}
}

export default Toggler;
