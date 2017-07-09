import React, {Component} from 'react';
import styled from 'styled-components';

import {Field} from './form';
import {Label, LabelTitle} from './primitives';

const ActualLabel = Label.withComponent('label');

const TransparentInput = styled(Field)`
	display: inline-block;
	font: inherit;
	background: transparent;
	border: none;
	appearance: none;
	padding: 0;

	&:focus {
		outline: none;
	}
`;

const Dummy = styled.div`
	display: inline-block;
	visibility: hidden;
	position: absolute;
	white-space: pre;
`;

export class AutosizingInput extends Component {
	constructor(props, ...args) {
		super(props, ...args);
		this.state = {
			value: props.value || props.defaultValue,
		};

		this.update = this.update.bind(this);
	}

	update(ev) {
		if (this.props.onChange) {
			this.props.onChange(ev);
		}

		this.setState(
			{
				value: ev.target.value,
			},
			() => this.updateWidth()
		);
	}

	componentDidMount() {
		this.updateWidth();
	}

	updateWidth() {
		if (this.input && this.dummy) {
			this.input.style.width =
				Math.max(this.dummy.offsetWidth + 2, this.props.minWidth) + 'px';
		}
	}

	render() {
		return (
			<span>
				<Dummy innerRef={el => (this.dummy = el)}>{this.state.value}</Dummy>
				<TransparentInput
					{...this.props}
					value={this.state.value}
					onChange={this.update}
					fieldRef={el => (this.input = el)}
				/>
			</span>
		);
	}
}

class LabelInput extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			focused: false,
		};
	}

	render() {
		return (
			<ActualLabel
				colour={this.props.colour}
				shade={this.props.shade}
				sunken
				large
				focused={this.state.focused}
			>
				<LabelTitle colour={this.props.colour} shade={this.props.shade}>
					{this.props.label}
				</LabelTitle>
				<AutosizingInput
					minWidth={100}
					{...this.props}
					onFocus={() => this.setState({focused: true})}
					onBlur={() => this.setState({focused: false})}
				/>
			</ActualLabel>
		);
	}
}

export default LabelInput;
