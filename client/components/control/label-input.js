import React, {Component} from 'react';
import styled from 'styled-components';

import {Field} from './form';
import {Label, LabelTitle, LabelBody} from '../visual/primitives';

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
	state = {
		value: this.props.value || this.props.defaultValue,
	};

	update = ev => {
		if (this.props.onChange) {
			this.props.onChange(ev);
		}

		this.setState(
			{ value: ev.target.value },
			() => this.updateWidth()
		);
	};

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
		const {minWidth: _, ...props} = this.props;
		return (
			<span>
				<Dummy innerRef={el => (this.dummy = el)}>{this.state.value}</Dummy>
				<TransparentInput
					{...props}
					value={this.state.value}
					onChange={this.update}
					fieldRef={el => (this.input = el)}
				/>
			</span>
		);
	}
}

class LabelInput extends Component {
	state = {
		focused: false,
	};

	render() {
		const {colour, shade, label, children, ...props} = this.props;

		return (
			<ActualLabel
				colour={colour}
				shade={shade}
				sunken
				large
				focused={this.state.focused}
			>
				{label && <LabelTitle colour={colour} shade={shade}>
					{label}
				</LabelTitle>}
				<LabelBody>
					<AutosizingInput
						minWidth={100}
						{...props}
						onFocus={() => this.setState({focused: true})}
						onBlur={() => this.setState({focused: false})}
					/>
				</LabelBody>
				{children}
			</ActualLabel>
		);
	}
}

export default LabelInput;
