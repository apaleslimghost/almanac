import React, {Component} from 'react';
import PropTypes from 'prop-types';

const getValue = el =>
	el[
		{
			number: 'valueAsNumber',
			range: 'valueAsNumber',
			date: 'valueAsDate',
		}[el.type] || 'value'
	];

export class Field extends Component {
	static get contextTypes() {
		return {
			state: PropTypes.object,
			setState: PropTypes.func,
		};
	}

	render() {
		const {name} = this.props;
		return (
			<input
				type="text"
				{...this.props}
				value={this.context.state[name] || ''}
				onChange={ev =>
					this.context.setState({[name]: getValue(ev.target)})}
			/>
		);
	}
};

export class Form extends Component {
	constructor(props, ...args) {
		super(props, ...args);

		this.state = props.initialData;

		this.setState = this.setState.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	getChildContext() {
		return {
			state: this.state,
			setState: this.setState,
		};
	}

	static get childContextTypes() {
		return {
			state: PropTypes.object,
			setState: PropTypes.func,
		};
	}

	static get defaultProps() {
		return {initialData: {}};
	}

	onSubmit(ev) {
		ev.preventDefault();
		Promise.resolve(this.props.onSubmit(this.state)).then(() => {
			this.state = this.props.initialData;
			this.forceUpdate();
		});
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				{this.props.children}
			</form>
		);
	}
};
