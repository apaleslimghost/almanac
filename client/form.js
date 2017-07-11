import React, {Component} from 'react';
import PropTypes from 'prop-types';

// TODO: split into module

export const getInputValue = el =>
	el[
		{
			number: 'valueAsNumber',
			range: 'valueAsNumber',
			date: 'valueAsDate',
		}[el.type] || 'value'
	];

export const getSelectValue = el => el.options[el.selectedIndex].value;

export const Field = (props, context) => {
	const {name, fieldRef, tag: Tag = 'input'} = props;
	return (
		<Tag
			ref={fieldRef}
			type="text"
			{...props}
			value={context.state[name] || ''}
			onChange={ev => {
				if(props.onChange) {
					props.onChange(ev);
				}

				context.setState({
					[name]: getInputValue(ev.target)
				})
			}}
		/>
	);
};

export const Select = (props, context) => {
	const {name} = props;
	return (
		<select
			{...props}
			value={context.state[name] || ''}
			onChange={ev => {
				context.setState({
					[name]: getSelectValue(ev.target)
				});
			}}
		>{props.children}</select>
	);
};

export class Form extends Component {
	constructor(props, ...args) {
		super(props, ...args);

		this.state = props.initialData;

		this.setState = this.setState.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	static get childContextTypes() {
		return {
			state: PropTypes.object,
			setState: PropTypes.func,
		};
	}

	static get defaultProps() {
		return {
			initialData: {},
			onSubmit() {},
			tagName: 'form',
		};
	}

	componentWillUpdate(props, state) {
		if(this.context.setState && props.name) {
			this.context.setState({
				[props.name]: state
			});
		}
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnount() {
		this.mounted = false;
	}

	getChildContext() {
		return {
			state: this.state,
			setState: this.setState,
		};
	}

	onSubmit(ev) {
		//TODO validation
		ev.preventDefault();
		Promise.resolve(this.props.onSubmit(this.state)).then(() => {
			if(this.mounted) {
				this.state = this.props.initialData;
				this.forceUpdate();
			}
		});
	}

	render() {
		return (
			<this.props.tagName onSubmit={this.onSubmit}>
				{this.props.children}
			</this.props.tagName>
		);
	}
};

export const fieldLike = {
	state: PropTypes.object,
	setState: PropTypes.func,
};

Field.contextTypes = Select.contextTypes = Form.contextTypes = fieldLike;
