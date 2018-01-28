import React, {Component} from 'react';

class Toggler extends Component {
	state = {on: false};

	toggle = () => {
		this.setState(({on}) => ({on: !on}));
	}

	render() {
		return this.state.on
			? <this.props.active toggle={this.toggle} {...this.props} />
			: <this.props.inactive toggle={this.toggle} {...this.props} />;
	}
}

export default Toggler;
