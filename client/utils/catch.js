import React, {Component} from 'react';
import {wrapDisplayName, compose} from 'recompose';

const withCatch = onCatch => Child => class Catcher extends Component {
	static displayName = wrapDisplayName(Child, 'withCatch');

	componentDidCatch(error, info) {
		return onCatch(error, info, this.props);
	}

	render() {
		return <Child {...this.props} />;
	}
};

export default withCatch;
